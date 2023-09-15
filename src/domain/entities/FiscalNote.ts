export type Item = {
    name: string
    quantity: number
    unit: string
    price: number,
}

export default class FiscalNote {
    constructor(readonly date: Date, readonly items: Item[]) {}

    
}