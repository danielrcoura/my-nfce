export default interface FiscalNoteExtractor {
    extract(html: Buffer): any
}