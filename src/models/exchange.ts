import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";

export class Exchange {
    constructor(
        public readonly id: string,
        public readonly assignedPeople:boolean,
        public readonly familyMembersBuyingForChildren: string[],
        public readonly numberOfGiftsPerFamilyMember: number,
        public readonly participatingChildren: string[],
        public readonly participatingFamilyMembers: string[],
        public readonly year: string,
    ) { }
}

export const exchangeConverter = {
    toFirestore: (exchange:Exchange) => {
        return {
            'id':exchange.id,
            'assignedPeople':exchange.assignedPeople,
            'familyMembersBuyingForChildren':exchange.familyMembersBuyingForChildren,
            'numOfGifts':exchange.numberOfGiftsPerFamilyMember,
            'participatingMembers':exchange.participatingFamilyMembers,
            'participatingChildren':exchange.participatingChildren,
            'year':exchange.year,
        };
    },
    fromFirestore: (snapshot:QueryDocumentSnapshot, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        console.debug(data)
        return new Exchange(
            data['id'] ?? '',
            data['assignedPeople'],
            data['familyMembersBuyingForChildren'],
            data['numOfGifts'],
            data['participatingChildren'],
            data['participatingMembers'],
            data['year']
        );
    }
};