export type Item = {
    name: string
    quantity: number
    unit: string
    price: number,
}

export type ItemsPrices = Record<string, number>

export type FiscalNoteSummary = Record<string, ItemSummary>

type ItemSummary = {
    quantity: number
    unit: string
    price: number,
}

export default class FiscalNote {
    readonly summary: FiscalNoteSummary

    constructor(readonly id: string, readonly date: Date, readonly items: Item[]) {
        this.summary = this.summarize(items)
    }

    private summarize(items: Item[]) {
        return items.reduce((result, item) => {
            if (result[item.name]) {
                result[item.name].quantity += item.quantity
            } else {
                result[item.name] = {
                    price: item.price,
                    quantity: item.quantity,
                    unit: item.unit,
                }
            }
            return result
        }, {} as Record<string, ItemSummary>)
    }
}