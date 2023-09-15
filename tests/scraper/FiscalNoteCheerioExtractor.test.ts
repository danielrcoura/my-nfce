import fs from 'fs'
import FiscalNoteCheerioExtractor from '../../src/scraper/FiscalNoteCheerioExtractor'

describe('FiscalNoteCheerioExtractor', () => {
  it('read html file', async () => {
    const html = fs.readFileSync(__dirname + '/../fixtures/nfce.html')
    const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()

    const fiscalNote = fiscalNoteCheerioExtractor.extract(html)
    console.log(fiscalNote.slice(0,3))
  });
})
  