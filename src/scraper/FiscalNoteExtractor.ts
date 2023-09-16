import FiscalNote from "../domain/entities/FiscalNote";

export default interface FiscalNoteExtractor {
    extract(html: Buffer): FiscalNote
}