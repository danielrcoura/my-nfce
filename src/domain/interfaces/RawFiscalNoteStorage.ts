export default interface RawFiscalNoteStorage {
    save(fileName: string, file: Buffer): Promise<void>
}