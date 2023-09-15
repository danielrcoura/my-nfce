import FiscalNote, { ItemsPrices } from "../entities/FiscalNote";

export default interface ItemsRepo {
    getMonthMedianItemsPrices(items: string[], date: Date): ItemsPrices
    save(fiscalNote: FiscalNote): Promise<void>
}