import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";

export class Child {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly pictureUrl: string | null = null,
    ) { }
}

export const childConverter = {
    toFirestore: (child:Child) => {
        return {
            id:child.id,
            name: child.name,
            picture: child.pictureUrl,
        };
    },
    fromFirestore: (snapshot:QueryDocumentSnapshot, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        const pictureUrl = (data['picture'])??null
        return new Child(data['id'],data['name'],pictureUrl);
    }
};