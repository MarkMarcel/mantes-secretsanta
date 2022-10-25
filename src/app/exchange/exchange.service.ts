import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, onSnapshot, query, setDoc, Unsubscribe, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Child, childConverter } from 'src/models/child';
import { Exchange, exchangeConverter } from 'src/models/exchange';
import { ItemWanted, itemWantedConverter } from 'src/models/item-wanted';
import { User, userConverter } from 'src/models/user';
import { UserExchange, userExchangeConverter } from 'src/models/user-exchange';
import { FirestoreCollectionPath } from '../firebase-paths';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private _exchangesCollection: CollectionReference;
  private _usersRefCollection: CollectionReference;

  constructor(private firestore: Firestore, private userService: UserService) {
    this._exchangesCollection = collection(this.firestore, FirestoreCollectionPath.exchanges);
    this._usersRefCollection = collection(firestore, FirestoreCollectionPath.users);
  }

  async assignSecretSantas(exchangeId: string): Promise<boolean> {
    const checkAdults = new Map<string, number>()
    const checkChildren = new Map<string, number>()
    await setDoc(doc(this._exchangesCollection, exchangeId), { 'isAssigning': true }, { merge: true });
    const batch = writeBatch(this.firestore);
    const exchange = (await getDoc(doc(this._exchangesCollection, exchangeId).withConverter(exchangeConverter))).data()!!;
    this.setupValidationChecks(exchange.participatingFamilyMembers, exchange.participatingChildren, checkAdults, checkChildren)
    let adults = exchange.participatingFamilyMembers.flatMap(id => Array(exchange.numberOfGiftsPerFamilyMember).fill(id));
    const numberOfGiftsPerChild = Math.floor(exchange.familyMembersBuyingForChildren.length / exchange.participatingChildren.length);
    let children = exchange.participatingChildren.flatMap(id => Array(numberOfGiftsPerChild).fill(id));
    const childrenOfThoseBuyingForChildren = await this.getChildrenOfThoseBuyingForChildren(exchange.familyMembersBuyingForChildren);
    exchange.participatingFamilyMembers.forEach((familyMemberId) => {
      const path = `${this._usersRefCollection.path}/${familyMemberId}/${FirestoreCollectionPath.exchanges}/${exchange.id}`;
      const assignedAdults = this.assignAdults(familyMemberId, adults, exchange.numberOfGiftsPerFamilyMember);
      //update checkAdults
      assignedAdults.forEach(id => {
        checkAdults.set(id, (checkAdults.get(id)!! + 1));
      });
      batch.update(doc(this.firestore, path), { 'assignedAdults': assignedAdults })
      if (exchange.familyMembersBuyingForChildren.includes(familyMemberId)) {
        const eligibleChildren = children.filter(id => !(childrenOfThoseBuyingForChildren.get(familyMemberId)!!.includes(id)));
        const assignedChild = (eligibleChildren.length > 0) ? this.assignChild(eligibleChildren) : null;
        //update checkChildren
        if (assignedChild != null) checkChildren.set(assignedChild, (checkChildren.get(assignedChild)!! + 1));
        children = children.filter(id => (id != assignedChild))
        batch.update(doc(this.firestore, path), { 'assignedChild': assignedChild })
      }
    });
    if (this.validateAssignments(checkAdults, checkChildren, exchange.numberOfGiftsPerFamilyMember, numberOfGiftsPerChild)) {
      batch.update(doc(this._exchangesCollection, exchangeId), { 'assignedPeople': true, 'isAssigning': false })
      await batch.commit();
      return true;
    } else {
      await setDoc(doc(this._exchangesCollection, exchangeId), { 'isAssigning': false }, { merge: true });
      return false;
    }
  }

  async deleteItemWanted(item: ItemWanted) {
    const path = `${this._usersRefCollection.path}/${item.userId}/${FirestoreCollectionPath.exchanges}/${item.exchangeId}/${FirestoreCollectionPath.itemsWanted}`;
    await deleteDoc(doc(collection(this.firestore, path), item.id));
  }

  async getAllExchanges(): Promise<Exchange[]> {
    const data = await getDocs(query(this._exchangesCollection).withConverter(exchangeConverter));
    return data.docs.map(doc => doc.data()).sort((exchange1, exchange2) => exchange1.year.localeCompare(exchange2.year));
  }

  async getAllUserExchanges(userId: string): Promise<UserExchange[]> {
    const path = `${this._usersRefCollection.path}/${userId}/${FirestoreCollectionPath.exchanges}`;
    const data = await getDocs(query(collection(this.firestore, path)).withConverter(userExchangeConverter));
    return data.docs.map(doc => doc.data()).sort((exchange1, exchange2) => exchange1.year.localeCompare(exchange2.year));
  }

  getIdForNewItemWanted(exchangeId: string, userId: string): string {
    const path = `${this._usersRefCollection.path}/${userId}/${FirestoreCollectionPath.exchanges}/${exchangeId}/${FirestoreCollectionPath.itemsWanted}`;
    return doc(collection(this.firestore, path)).id;
  }

  async getUserExchangeAssignedAdults(assignedAdults: string[]): Promise<User[]> {
    const assignedAdultsData = await getDocs(query(this._usersRefCollection, where('id', 'in', assignedAdults)).withConverter(userConverter));
    return assignedAdultsData.docs.map(doc => doc.data()).sort((user1, user2) => user1.name.localeCompare(user2.name));
  }

  async getUserExchangeAssignedChild(assignedChild: string): Promise<Child> {
    return (await getDoc(doc(collection(this.firestore, FirestoreCollectionPath.children), assignedChild).withConverter(childConverter))).data()!!;
  }

  observeExchange(exchangeId: string, callback: (arg0: boolean) => void): Unsubscribe {
    return onSnapshot(doc(this._exchangesCollection, exchangeId), (doc) => {
      callback(doc.data()!!['isAssigning']);
    });
  }

  observeItemsWanted(exchangeId: string, userId: string): Observable<ItemWanted[]> {
    const path = `${this._usersRefCollection.path}/${userId}/${FirestoreCollectionPath.exchanges}/${exchangeId}/${FirestoreCollectionPath.itemsWanted}`;
    return collectionData(collection(this.firestore, path).withConverter(itemWantedConverter))
  }

  async saveItemWanted(item: ItemWanted) {
    const path = `${this._usersRefCollection.path}/${item.userId}/${FirestoreCollectionPath.exchanges}/${item.exchangeId}/${FirestoreCollectionPath.itemsWanted}`;
    await setDoc(doc(collection(this.firestore, path), item.id).withConverter(itemWantedConverter), item);
  }

  async saveExchangeDetails(exchange: Exchange) {
    const existing = await getDocs(query(this._exchangesCollection));
    const batch = writeBatch(this.firestore);
    const docRef = (!existing.empty) ? existing.docs[0].ref : doc(this._exchangesCollection);
    const updatedExchange = new Exchange(docRef.id, exchange.assignedPeople, exchange.familyMembersBuyingForChildren, exchange.numberOfGiftsPerFamilyMember, exchange.participatingChildren, exchange.participatingFamilyMembers, exchange.year);
    const updatedExchangeSubDetails = { 'id': updatedExchange.id, 'year': updatedExchange.year };
    updatedExchange.participatingFamilyMembers.forEach((familyMemberId) => {
      const path = `${this._usersRefCollection.path}/${familyMemberId}/${FirestoreCollectionPath.exchanges}/${docRef.id}`;
      batch.set(doc(this.firestore, path), updatedExchangeSubDetails);
    });
    batch.set(docRef, exchangeConverter.toFirestore(updatedExchange));
    await batch.commit();
  }

  async setItemWantedPurchased(item: ItemWanted) {
    const path = `${this._usersRefCollection.path}/${item.userId}/${FirestoreCollectionPath.exchanges}/${item.exchangeId}/${FirestoreCollectionPath.itemsWanted}`;
    await setDoc(doc(collection(this.firestore, path), item.id), { 'purchased': true }, { merge: true });
  }

  private assignAdults(familyMemberId: string, remainingAdults: string[], numOfGifts: number): string[] {
    let eligibleAdults = remainingAdults.filter(id => (id != familyMemberId));
    const assigned: string[] = [];
    for (let i = 0; i < numOfGifts; i++) {
      const selectedId = eligibleAdults[Math.floor(Math.random() * eligibleAdults.length)];
      assigned.push(selectedId);
      //To ensure you don't get someone twice
      eligibleAdults = eligibleAdults.filter(id => (id != selectedId));
    }
    assigned.forEach(id => {
      const i = remainingAdults.indexOf(id);
      remainingAdults.splice(i, 1);
    });
    return assigned;
  }

  private assignChild(eligibleChildren: string[]): string {
    return eligibleChildren[Math.floor(Math.random() * eligibleChildren.length)];
  }

  private async getChildrenOfThoseBuyingForChildren(buyingForChildren: string[]): Promise<Map<string, string[]>> {
    const children = new Map<string, string[]>()
    const users = await this.userService.getAllUsers();
    users.forEach(user => {
      if (buyingForChildren.includes(user.id)) {
        children.set(user.id, user.childrenIds);
      }
    });
    return children;
  }

  private setupValidationChecks(adults: string[], children: string[], checkAdults: Map<string, number>, checkChildren: Map<string, number>) {
    adults.forEach(id => checkAdults.set(id, 0));
    children.forEach(id => checkChildren.set(id, 0));
  }

  private validateAssignments(checkAdults: Map<string, number>, checkChildren: Map<string, number>, numberOfGifts: number, numberOfGiftsPerChild: number): boolean {
    for (let num of checkAdults.values()) {
      if (num != numberOfGifts) return false;
    }
    for (let num of checkChildren.values()) {
      if (num != numberOfGiftsPerChild) return false;
    }
    return true;
  }
}
