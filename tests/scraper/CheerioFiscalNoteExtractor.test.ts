import fs from 'fs'
import CheerioFiscalNoteExtractor from '../../src/scraper/CheerioFiscalNoteExtractor'

describe('CheerioFiscalNoteExtractor', () => {
  it('read html file', async () => {
    const html = fs.readFileSync(__dirname + '/../fixtures/nfce.html')
    const cheerioFiscalNoteExtractor = new CheerioFiscalNoteExtractor()

    const fiscalNote = cheerioFiscalNoteExtractor.extract(html)
    console.log(fiscalNote)
  });
})
  