import FiscalNoteExtractor from "./FiscalNoteExtractor";
import FiscalNoteFetcher from "./FiscalNoteFetcher";
import FiscalNoteScraper, { ScrapedFiscalNote } from "../domain/interfaces/FiscalNoteScraper";

export default class MyFiscalNoteScraper implements FiscalNoteScraper {
    constructor(private fetcher: FiscalNoteFetcher, private extractor: FiscalNoteExtractor) {}

    async scrape(url: string): Promise<ScrapedFiscalNote> {
        const html = await this.fetcher.fetch(url) 
        const fiscalNote = this.extractor.extract(html)
        return { html, fiscalNote }
    }
}