import FiscalNote, { ItemsPrices } from "../entities/FiscalNote";

export type ItemDataPoint = {
	date: Date
	price: number
}

export type CategoryTotal = {
    name: string
    total: number
}

export default interface ItemsRepo {
    getMonthMedianItemsPrices(items: string[], date: Date): ItemsPrices
    save(fiscalNote: FiscalNote): Promise<void>
    getItemTimeline(id: number): Promise<ItemDataPoint[]>
    summariseByCategory(key: string): Promise<CategoryTotal[]>
}