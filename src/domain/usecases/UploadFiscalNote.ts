import ItemsRepo from '../interfaces/ItemsRepo'
import FiscalNoteScraper from '../interfaces/FiscalNoteScraper'
import RawFiscalNoteStorage from '../interfaces/RawFiscalNoteStorage'

export default class UploadFiscalNoteUsecase {
    constructor(
        private fiscalNoteScraper: FiscalNoteScraper,
        private rawFiscalNoteStorage: RawFiscalNoteStorage,
        private itemsRepo: ItemsRepo
    ) {}

    async exec(url: string): Promise<void> {
        // TODO: verify if it was uploaded before
        const { html, fiscalNote } = await this.fiscalNoteScraper.scrape(url)
        await this.rawFiscalNoteStorage.save(`${fiscalNote.id}.html`, html)
        return this.itemsRepo.save(fiscalNote)
    }
}