import FsHtmlFetcher from '../../src/scraper/FsHtmlFetcher'

describe('FsHtmlFetcher', () => {
  it('should fetch a file by url', async () => {
    const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230107110635000271651060000638791220983458&Token=F8F7A2D1C38876E554D0028FBBE180E8'
    const fsHtmlFetcher = new FsHtmlFetcher()
    const buffer = await fsHtmlFetcher.fetch(url)
    console.log(buffer.toString())
  });

})
