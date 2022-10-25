import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { ItemPlaceHolderUrl } from "src/app/firebase-paths";

export class ItemWanted {
    constructor(
        public readonly id: string,
        public readonly exchangeId:string,
        public readonly userId:string,
        public readonly googleMapsUrl: string | null,
        public readonly name: string,
        public readonly pictureUrl: string = ItemPlaceHolderUrl,
        public readonly purchased:boolean = false,
    ) { }
}

export const itemWantedConverter = {
    toFirestore: (item: ItemWanted) => {
        return {
            id: item.id,
            exchange:item.exchangeId,
            user:item.userId,
            googleMap: item.googleMapsUrl,
            name: item.name,
            picture: item.pictureUrl,
            purchased:item.purchased,
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        const pictureUrl = (data['picture']) ?? ItemPlaceHolderUrl;
        return new ItemWanted(data['id'],data['exchange'],data['user'], data['googleMap'], data['name'], pictureUrl,data['purchased']);
    }
};