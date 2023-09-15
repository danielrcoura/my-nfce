import fiscalNoteExtractor from '../interfaces/FiscalNoteExtractor'
import HtmlFetcher from '../interfaces/FiscalNoteFetcher'

export default class UploadFiscalNoteUsecase {
    constructor(private htmlFetcher: HtmlFetcher, private fiscalNoteExtractor: fiscalNoteExtractor) {}

    async exec(url: string) {
        const html = await this.htmlFetcher.fetch(url)
        // TODO: save html
        const fiscalNote = this.fiscalNoteExtractor.extract(html)
        // TODO: save in DB
    }
}