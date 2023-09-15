export type Item = {
    name: string
    quantity: number
    unit: string
    price: number,
}

export type ItemsPrices = Record<string, number>

export default class FiscalNote {
    constructor(readonly date: Date, readonly items: Item[]) {}

    getItemsPrices() {
        const itemsPrices: ItemsPrices = {}
        return this.items.reduce((result, item) => {
            result[item.name] = result.price
            return result
        }, itemsPrices)
    }
}