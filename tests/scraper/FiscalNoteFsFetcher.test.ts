import FiscalNoteFsFetcher from '../../src/scraper/FiscalNoteFsFetcher'

describe('FiscalNoteFsFetcher', () => {
  it('should fetch a file by url', async () => {
    const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230107110635000271651060000638791220983458&Token=F8F7A2D1C38876E554D0028FBBE180E8'
    const fiscalNoteFsFetcher = new FiscalNoteFsFetcher()
    const html = await fiscalNoteFsFetcher.fetch(url)
    console.log(html.toString())
  });
})
