import FiscalNote from "../entities/FiscalNote"

export type ScrapedFiscalNote = {
    html: Buffer
    fiscalNote: FiscalNote
}

export default interface FiscalNoteScraper {
    scrape(url: string): Promise<ScrapedFiscalNote>
}