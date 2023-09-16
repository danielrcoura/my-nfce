export default interface FiscalNoteFetcher {
    fetch(url: string): Promise<Buffer>
}