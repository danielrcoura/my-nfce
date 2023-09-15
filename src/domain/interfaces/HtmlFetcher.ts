export default interface HtmlFetcher {
    fetch(url: string): Promise<Buffer>
}