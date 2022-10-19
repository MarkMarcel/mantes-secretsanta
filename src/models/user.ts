import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";

export class User {
    constructor(
        public readonly id: string,
        public readonly childrenIds: string[],
        public readonly isMarried: boolean,
        public readonly name: string,
        public readonly pictureUrl: string | null = null,
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
            picture: user.pictureUrl,
            exchanges:user.secretSantaExchanges
        };
    },
    fromFirestore: (snapshot:QueryDocumentSnapshot, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        const childrenIds = (data['children'])??[]
        const pictureUrl = (data['picture'])??null
        const secretSantaExchanges = (data['exchanges'])??[]
        return new User(data['id'],childrenIds,data['married'],data['name'],pictureUrl,secretSantaExchanges);
    }
};