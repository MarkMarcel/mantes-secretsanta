export class Exchange {
    constructor(
        public readonly id: string,
        public readonly buyingForChildren: string[],
        public readonly numberOfGiftsPerFamilyMember: number,
        public readonly participatingChildren: string[],
        public readonly participatingFamilyMembers: string[],
        public readonly year: number,
    ) { }
}

export const mapDataToExchangeModel = (data: any): Exchange | String => {
    if (!data['buyingForChildren'] || !data['numOfGifts'] || !data['participatingMembers'] || !data['participatingChildren'] || !data['year'])
        return "Missing required details";
    else return new Exchange(
        data['id'] ?? '',
        data['buyingForChildren'],
        data['numOfGifts'],
        data['participatingMembers'],
        data['participatingChildren'],
        data['year']
    )
}

export const mapExchangeModelToData = (exchange:Exchange):any => {
    return {
        'id':exchange.id,
        'buyingForChildren':exchange.buyingForChildren,
        'numOfGifts':exchange.numberOfGiftsPerFamilyMember,
        'participatingMembers':exchange.participatingFamilyMembers,
        'participatingChildren':exchange.participatingChildren,
        'year':exchange.year,
    }
}