import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { PersonPlaceHolderUrl } from "src/app/firebase-paths";

export const AdminIds = [
    "ccZQKHt4uuV3JpDccPaOsZU5qIs1",
    "0nf0AWva8AbQs43Y5lyUIynJB5C2",
    "Y9tTalIJ3heJOuq3d2ocV9zNRw03"
];

export class User {
    constructor(
        public readonly id: string,
        public readonly childrenIds: string[],
        public readonly isMarried: boolean,
        public readonly name: string,
        public readonly pictureUrl: string = PersonPlaceHolderUrl,
        public readonly secretSantaExchanges: string[] = [],
    ) { }
};

export const userConverter = {
    toFirestore: (user:User) => {
        return {
            id:user.id,
            children:user.childrenIds,
            married:user.isMarried,
            name: user.name,
            pictureUrl: user.pictureUrl,
            exchanges:user.secretSantaExchanges
        };
    },
    fromFirestore: (snapshot:QueryDocumentSnapshot, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        const childrenIds = (data['children'])??[]
        const pictureUrl = (data['pictureUrl'])??PersonPlaceHolderUrl
        const secretSantaExchanges = (data['exchanges'])??[]
        return new User(data['id'],childrenIds,data['married'],data['name'],pictureUrl,secretSantaExchanges);
    }
};