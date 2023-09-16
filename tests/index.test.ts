import FsItemsRepo from '../src/items-repo/FsItemsRepo'
import FiscalNoteFsFetcher from '../src/scraper/FiscalNoteFsFetcher'
import FiscalNoteCheerioExtractor from '../src/scraper/FiscalNoteCheerioExtractor'
import MyFiscalNoteScraper from '../src/scraper/MyFiscalNoteScraper'
import UploadFiscalNoteUsecase from '../src/domain/usecases/UploadFiscalNote'
import CalculateFiscalNoteVariationUsecase from '../src/domain/usecases/CalculateFiscalNoteVariation'

const fsItemsRepo = new FsItemsRepo()
const fiscalNoteFsFetcher = new FiscalNoteFsFetcher()
const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()
const fiscalNoteScraper = new MyFiscalNoteScraper(fiscalNoteFsFetcher, fiscalNoteCheerioExtractor)

const uploadFiscalNoteUsecase = new UploadFiscalNoteUsecase(fiscalNoteScraper, fsItemsRepo)
const calculateFiscalNoteVariationUsecase = new CalculateFiscalNoteVariationUsecase(fsItemsRepo)

describe('Main', () => {
    xit('uploadFiscalNoteUsecase', async () => {
        const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230107110635000271651060000638791220983458&Token=F8F7A2D1C38876E554D0028FBBE180E8'
        uploadFiscalNoteUsecase.exec(url)
    });

    xit('uploadFiscalNoteUsecase', async () => {
        const ids = [
            '24230107110635000271651060000638791220983458',
            '24230107110635000271651070001360981215656707',
            '24230107110635000271651070001373751227755647',
            '24230207110635000271651080001085941251081880',
            '24230207110635000271651090001410381258055771',
            '24230307110635000271651090001415511263176959',
            '24230312988127000220650060002412721518005127',
            '24230320555904000190650240002306871116718115',
            '24230320555904000190650250001294171535855320',
            '24230407110635000271651050000358471305652510',
            '24230407110635000271651070001445831299464138',
            '24230407110635000271651080001145501311558910',
            '24230407110635000271651100001427931292618600',
            '24230420555904000190650220002638381635317717',
            '24230507110635000271650190001757211321065750',
            '24230907110635000271651060000784731426617295'
        ]
     
        for (let id of ids) {
            const url = `nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=${id}&Token=F8F7A2D1C38876E554D0028FBBE180E8`
            await uploadFiscalNoteUsecase.exec(url)
        }
    });
    
    
    it('calculateFiscalNoteVariationUsecase', async () => {
        const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230907110635000271651060000784731426617295&Token=F8F7A2D1C38876E554D0028FBBE180E8'
        const fiscalNote = fiscalNoteCheerioExtractor.extract(await fiscalNoteFsFetcher.fetch(url))
        console.log(calculateFiscalNoteVariationUsecase.exec(fiscalNote, 3))
    });
  })
    