import FiscalNotePuppeteerFetcher from '../../src/scraper/FiscalNotePuppeteerFetcher'

describe('FiscalNoteFsFetcher', () => {
  it('should fetch a file by url', async () => {
    const url = 'http://nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230807110635000271651060000777111415276276&Token=F39FA0A3E5B0AFA8AA6BC7457FD356CF'
    const fetcher = new FiscalNotePuppeteerFetcher()
    await fetcher.init(url)
  });
})
