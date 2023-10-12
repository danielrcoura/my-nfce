import ItemsRepo, { CategoryTotal } from '../interfaces/ItemsRepo'
import FiscalNoteScraper from '../interfaces/FiscalNoteScraper'
import RawFiscalNoteStorage from '../interfaces/RawFiscalNoteStorage'
import FiscalNote from '../entities/FiscalNote'

export type UploadFiscalNoteResponse = {
    categories: CategoryTotal[]
    lastPrices: any[]
    fiscalNote: FiscalNote
}

export default class UploadFiscalNoteUsecase {
    constructor(
        private fiscalNoteScraper: FiscalNoteScraper,
        private rawFiscalNoteStorage: RawFiscalNoteStorage,
        private itemsRepo: ItemsRepo
    ) {}

    async exec(url: string): Promise<UploadFiscalNoteResponse> {
        // TODO: verify if it was uploaded before
        const { html, fiscalNote } = await this.fiscalNoteScraper.scrape(url)
        await this.rawFiscalNoteStorage.save(`${fiscalNote.id}.html`, html)
        await this.itemsRepo.save(fiscalNote)
        const categories = await this.itemsRepo.summariseByCategory(fiscalNote.id)
        const lastPrices = await this.getLastItemsPrices(fiscalNote)
        return { categories, lastPrices, fiscalNote }
    }

    async getLastItemsPrices(fiscalNote: FiscalNote): Promise<any[]> {
        const lastItemsPrices = await this.itemsRepo.getLastItemsPrices(fiscalNote.id)
        const result: any[] = []
        lastItemsPrices.forEach(itemPrice => {
            const itemSummary = fiscalNote.summary[itemPrice.name]
            const currentTotal = itemSummary.price * itemSummary.quantity
            const lastTotal = itemPrice.last_price * itemSummary.quantity
            result.push({
                item: itemPrice.name,
                diff: currentTotal - lastTotal,
                date: itemPrice.last_date,
                quantity: itemSummary.quantity,
                unit: itemSummary.unit
            })
        })
        result.sort((a, b) => b.diff**2 - a.diff**2)
        return result.slice(0, 10)
    }
}
