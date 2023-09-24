import FsItemsRepo from '../src/items-repo/FsItemsRepo'
import FiscalNoteCheerioExtractor from '../src/scraper/FiscalNoteCheerioExtractor'
import MyFiscalNoteScraper from '../src/scraper/MyFiscalNoteScraper'
import UploadFiscalNoteUsecase from '../src/domain/usecases/UploadFiscalNote'
import CalculateFiscalNoteVariationUsecase from '../src/domain/usecases/CalculateFiscalNoteVariation'
import FiscalNotePupepeteerFetcher from '../src/scraper/FiscalNotePuppeteerFetcher'

const fsItemsRepo = new FsItemsRepo()
const fiscalNotePupepeteerFetcher = new FiscalNotePupepeteerFetcher()
const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()
const fiscalNoteScraper = new MyFiscalNoteScraper(fiscalNotePupepeteerFetcher, fiscalNoteCheerioExtractor)

const uploadFiscalNoteUsecase = new UploadFiscalNoteUsecase(fiscalNoteScraper, fsItemsRepo)
const calculateFiscalNoteVariationUsecase = new CalculateFiscalNoteVariationUsecase(fsItemsRepo)

describe('Main', () => {
    it('upload single fiscal note', async () => {
        const url = 'http://nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230107110635000271651060000638791220983458&Token=F8F7A2D1C38876E554D0028FBBE180E8'
        await uploadFiscalNoteUsecase.exec(url)
    }, 30000);

    xit('upload multiple fiscal notes', async () => {
        const ids = [
            '24230107110635000271651060000638791220983458',
            '24230507110635000271651070001470931328839730',
            '24230107110635000271651070001360981215656707',
            '24230507110635000271651080001166351334889205',
            '24230107110635000271651070001373751227755647',
            '24230507110635000271651090001469971317679296',
            '24230207110635000271651080001085941251081880',
            '24230607110635000271651070001488921346982226',
            '24230207110635000271651090001410381258055771',
            '24230607110635000271651090001488411340934649',
            '24230307110635000271651090001415511263176959',
            '24230607110635000271651090001508041365124040',
            '24230312988127000220650060002412721518005127',
            '24230607110635000271651120001599771360086519',
            '24230320555904000190650240002306871116718115',
            '24230707110635000271651100001502511372040859',
            '24230320555904000190650250001294171535855320',
            '24230707110635000271651100001509591378156758',
            '24230407110635000271651050000358471305652510',
            '24230707110635000271651100001516931384135830',
            '24230407110635000271651070001445831299464138',
            '24230707110635000271651110001722001390223360',
            '24230407110635000271651080001145501311558910',
            '24230807110635000271651050000394331408421966',
            '24230407110635000271651100001427931292618600',
            '24230807110635000271651060000777111415276276',
            '24230420555904000190650220002638381635317717',
            '24230807110635000271651090001539551401417559',
            '24230507110635000271650190001757211321065750',
            '24230807110635000271651100001550101417837087',
            '24230507110635000271651070001466751322828885',
            '24230907110635000271651060000784731426617295',
        ]
     
        for (let id of ids) {
            const url = `nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=${id}&Token=F8F7A2D1C38876E554D0028FBBE180E8`
            await uploadFiscalNoteUsecase.exec(url)
        }
    });
    
    
    // xit('calculate fiscal note variation', async () => {
    //     const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230907110635000271651060000784731426617295&Token=F8F7A2D1C38876E554D0028FBBE180E8'
    //     const fiscalNote = fiscalNoteCheerioExtractor.extract(await fiscalNoteFsFetcher.fetch(url))
    //     const result = calculateFiscalNoteVariationUsecase.exec(fiscalNote, 8)
    //     console.log(result)
    // });

    // xit('calculate fiscal note with less missing items', async () => {
    //     const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230907110635000271651060000784731426617295&Token=F8F7A2D1C38876E554D0028FBBE180E8'
    //     const fiscalNote = fiscalNoteCheerioExtractor.extract(await fiscalNoteFsFetcher.fetch(url))
    //     let result
    //     let diff = 0
    //     for (let i = 1; i <= 11; i++) {
    //         const variation = calculateFiscalNoteVariationUsecase.exec(fiscalNote, i)
    //         console.log(variation.variation, variation.missingItems.length)
    //         if (!result || (variation.variation > result.variation && variation.itemsVariation.length>5)) {
    //             result = variation
    //             diff = i
    //         }
    //     }
    //     console.log(result, diff)
    // });
  })
    