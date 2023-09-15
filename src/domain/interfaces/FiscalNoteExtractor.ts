import FiscalNote from "../entities/FiscalNote";

export default interface FiscalNoteExtractor {
    extract(html: Buffer): FiscalNote
}