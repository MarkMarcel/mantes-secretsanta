import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, query, writeBatch } from '@angular/fire/firestore';
import { Exchange, exchangeConverter } from 'src/models/exchange';
import { FirestoreCollectionPaths } from '../firestore.collection.paths';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(private firestore: Firestore) { }

  async assignSecretSantas(exchangeId:string){
    
  }

  async saveExchangeDetails(exchange: Exchange) {
    const exchangesRef = collection(this.firestore, FirestoreCollectionPaths.exchanges);
    const usersRef = collection(this.firestore,FirestoreCollectionPaths.users);
    const existing = await getDocs(query(exchangesRef));
    const batch = writeBatch(this.firestore);
    const docRef = (!existing.empty) ? existing.docs[0].ref : doc(exchangesRef);
    const updatedExchange = new Exchange(docRef.id,exchange.familyMembersBuyingForChildren,exchange.numberOfGiftsPerFamilyMember,exchange.participatingChildren,exchange.participatingFamilyMembers,exchange.year);
    const updatedExchangeSubDetails = {'id':updatedExchange.id,'year':updatedExchange.year};
    updatedExchange.participatingFamilyMembers.forEach((familyMemberId) => {
      const path = `${usersRef.path}/${familyMemberId}/${FirestoreCollectionPaths.exchanges}/${docRef.id}`;  
      batch.set(doc(this.firestore,path),updatedExchangeSubDetails);
    });
    batch.set(docRef,exchangeConverter.toFirestore(updatedExchange));
    await batch.commit();
  }
}
