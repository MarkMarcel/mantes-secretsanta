import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";

export class Exchange {
    constructor(
        public readonly id: string,
        public readonly familyMembersBuyingForChildren: string[],
        public readonly numberOfGiftsPerFamilyMember: number,
        public readonly participatingChildren: string[],
        public readonly participatingFamilyMembers: string[],
        public readonly year: number,
    ) { }
}

export const exchangeConverter = {
    toFirestore: (exchange:Exchange) => {
        return {
            'id':exchange.id,
            'familyMembersBuyingForChildren':exchange.familyMembersBuyingForChildren,
            'numOfGifts':exchange.numberOfGiftsPerFamilyMember,
            'participatingMembers':exchange.participatingFamilyMembers,
            'participatingChildren':exchange.participatingChildren,
            'year':exchange.year,
        };
    },
    fromFirestore: (snapshot:QueryDocumentSnapshot, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        return new Exchange(
            data['id'] ?? '',
            data['familyMembersBuyingForChildren'],
            data['numOfGifts'],
            data['participatingMembers'],
            data['participatingChildren'],
            data['year']
        );
    }
};