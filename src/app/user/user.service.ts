import { Injectable } from '@angular/core';
import { collection, CollectionReference, doc, Firestore, getDoc, getDocs, query, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Child, childConverter } from 'src/models/child';
import { User, userConverter } from 'src/models/user';
import { FirestoreCollectionPath } from '../firebase-paths';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _childrenCollection: CollectionReference;
  private readonly _userSource = new BehaviorSubject<User | null>(null);
  private _usersCollection: CollectionReference;

  readonly user$ = this._userSource.asObservable()

  constructor(firestore: Firestore) {
    this._childrenCollection = collection(firestore, FirestoreCollectionPath.children);
    this._usersCollection = collection(firestore, FirestoreCollectionPath.users);
  }

  async getAllChildren(): Promise<Child[]> {
    const data = await getDocs(query(this._childrenCollection).withConverter(childConverter));
    return data.docs.map(doc => doc.data()).sort((child1,child2) => child1.name.localeCompare(child2.name));
  }

  async getAllUsers(): Promise<User[]> {
    const data = await getDocs(query(this._usersCollection).withConverter(userConverter));
    return data.docs.map(doc => doc.data()).sort((user1,user2) => user1.name.localeCompare(user2.name))
  }

  async getChild(childId: string): Promise<Child | null> {
    const child = await getDoc(doc(this._childrenCollection, childId).withConverter(childConverter));
    if (child.exists()) {
      return child.data();
    } else {
      return null;
    }
  }

  async getUserDetails(userId: string): Promise<boolean> {
    const user = await getDoc(doc(this._usersCollection, userId).withConverter(userConverter));
    if (user.exists()) {
      this._userSource.next(user.data());
      return true;
    } else {
      this._userSource.next(null);
      return false;
    }
  }

  async updateChildPictureUrl(childId: string, pictureUrl: string): Promise<boolean> {
    //Delete prev image if exists
    const ref = doc(this._childrenCollection, childId)
    try {
      await setDoc(ref, { 'picture': pictureUrl }, { merge: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateUserDetails(user: User): Promise<boolean> {
    const ref = doc(this._usersCollection, user.id).withConverter(userConverter)
    try {
      await setDoc(ref, user, { merge: true });
      return true;
    } catch (error) {
      return false;
    }
  }
}
