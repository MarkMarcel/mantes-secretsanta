import * as admin from "firebase-admin";
import { Exchange, mapExchangeModelToData } from "./models/exchange";
import { FireStorePath } from "./firestore-paths";

export const saveExchangeDetails = async (details: Exchange) => {
    const data = mapExchangeModelToData(details);
    const existing = await admin.firestore().collection(FireStorePath.exchanges).where('year', '==', details.year).get();
    const doc = (existing.docs.length > 0) ? existing.docs[0].ref : admin.firestore().collection(FireStorePath.exchanges).doc();
    data.id = doc.id;
    await doc.set(data,{merge:true});
}