import { ItemsPrices } from "../dto/ItemsPrices"

export default interface ItemsRepo {
    getMonthMedianItemsPrices(items: string[], date: Date): ItemsPrices
}