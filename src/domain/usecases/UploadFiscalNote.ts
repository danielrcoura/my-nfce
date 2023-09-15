import FiscalNoteFetcher from '../interfaces/FiscalNoteFetcher'
import FiscalNoteExtractor from '../interfaces/FiscalNoteExtractor'
import ItemsRepo from '../interfaces/ItemsRepo'

export default class UploadFiscalNoteUsecase {
    constructor(
        private htmlFetcher: FiscalNoteFetcher,
        private fiscalNoteExtractor: FiscalNoteExtractor,
        private itemsRepo: ItemsRepo
    ) {}

    async exec(url: string): Promise<void> {
        const html = await this.htmlFetcher.fetch(url)
        const fiscalNote = this.fiscalNoteExtractor.extract(html)
        return this.itemsRepo.save(fiscalNote)
    }
}