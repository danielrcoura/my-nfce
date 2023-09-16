import ItemsRepo from '../interfaces/ItemsRepo'
import FiscalNoteScraper from '../interfaces/FiscalNoteScraper'

export default class UploadFiscalNoteUsecase {
    constructor(
        private fiscalNoteScraper: FiscalNoteScraper,
        private itemsRepo: ItemsRepo
    ) {}

    async exec(url: string): Promise<void> {
        const { html, fiscalNote } = await this.fiscalNoteScraper.scrape(url)
        await this.saveHtml(html)
        return this.itemsRepo.save(fiscalNote)
    }

    private async saveHtml(html: Buffer): Promise<void> {
        // TODO: store html
    }
}