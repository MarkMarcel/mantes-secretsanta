import { QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";


export class UserExchange{
    constructor(
        public readonly id: string,
        public readonly assignedAdults: string[],
        public readonly assignedChild: string|null,
        public readonly year: string,
    ) { }
}

export const userExchangeConverter = {
    toFirestore: (exchange:UserExchange) => {
        return {
            'id':exchange.id,
            'assignedAdults':exchange.assignedAdults,
            'assignedChild':exchange.assignedChild,
            'year':exchange.year,
        };
    },
    fromFirestore: (snapshot:QueryDocumentSnapshot, options:SnapshotOptions) => {
        const data = snapshot.data(options);
        return new UserExchange(
            data['id'] ?? '',
            data['assignedAdults']??[],
            data['assignedChild']??null,
            data['year']
        );
    }
};