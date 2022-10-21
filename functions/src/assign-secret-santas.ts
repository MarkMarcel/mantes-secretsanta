import * as admin from "firebase-admin";
import { Exchange, mapDataToExchangeModel } from "./models/exchange";
import { FireStorePath } from "./firestore-paths";

export const assignSecretSantas = async (id: string) => {
    const exchangeProtocols = await admin.firestore().collection(FireStorePath.exchanges).doc(id).get();
    const exchange = mapDataToExchangeModel(exchangeProtocols.data()) as Exchange;
    const batch = admin.firestore().batch();
    let adults = exchange.participatingFamilyMembers.flatMap(id => Array(exchange.numberOfGiftsPerFamilyMember).fill(id));
    const numberOfGiftsPerChild = Math.floor(exchange.buyingForChildren.length / exchange.participatingChildren.length);
    let children = exchange.participatingFamilyMembers.flatMap(id => Array(numberOfGiftsPerChild).fill(id));
    const childrenOfThoseBuyingForChildren = await getChildrenOfThoseBuyingForChildren(exchange.buyingForChildren);
    exchange.participatingFamilyMembers.forEach((familyMemberId) => {
        const assignedAdults = assignAdults(adults.filter(id => (id != familyMemberId)));
        batch.update(admin.firestore().collection(FireStorePath.users).doc(familyMemberId).collection(FireStorePath.exchanges).doc(exchange.id),{'assignedAdults':assignedAdults})
        adults = adults.filter(id => !(assignedAdults.includes(id)));
        if (exchange.buyingForChildren.includes(familyMemberId)) {
            const assignedChild = assignChild(familyMemberId,children.filter(id => !(childrenOfThoseBuyingForChildren.get(familyMemberId)!!.includes(id))));
            children = children.filter(id => (id != assignedChild))
            batch.update(admin.firestore().collection(FireStorePath.users).doc(familyMemberId).collection(FireStorePath.exchanges).doc(exchange.id),{'assignedChild':assignedChild})
        }
    });
    await batch.commit();
}

const assignAdults = (eligibleAdults: string[]): string[] => {
    const assigned: string[] = [];
    for (let i = 0; i < 3; i++) {
        const selected = Math.floor(Math.random() * eligibleAdults.length);
        assigned.push(eligibleAdults[selected]);
        eligibleAdults.splice(selected, selected);
    }
    return assigned;
}

const assignChild = (adultId: string, eligibleChildren: string[]):string => {
    return eligibleChildren[Math.floor(Math.random() * eligibleChildren.length)];
}

const getChildrenOfThoseBuyingForChildren = async (buyingForChildren:string[]):Promise<Map<string,string[]>> => {
    const children = new Map<string,string[]>()
    const users = (await admin.firestore().collection(FireStorePath.users).get()).docs;
    users.forEach(user =>{
        const data = user.data();
        if(buyingForChildren.includes(data['id'])){
            children.set(data['id'],data['children']);
        }
    });
    return children;
}