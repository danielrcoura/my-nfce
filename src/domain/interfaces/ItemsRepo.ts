import { ItemsPrices } from "../entities/FiscalNote";

export default interface ItemsRepo {
    getMonthMedianItemsPrices(items: string[], date: Date): ItemsPrices
}