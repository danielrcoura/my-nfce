import FsItemsRepo from './items-repo/FsItemsRepo'
import FiscalNoteFsFetcher from './scraper/FiscalNoteFsFetcher'
import FiscalNoteCheerioExtractor from './scraper/FiscalNoteCheerioExtractor'
import UploadFiscalNoteUsecase from './domain/usecases/UploadFiscalNote'

const fsItemsRepo = new FsItemsRepo()
const fiscalNoteFsFetcher = new FiscalNoteFsFetcher()
const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()
const uploadFiscalNoteUsecase = new UploadFiscalNoteUsecase(fiscalNoteFsFetcher, fiscalNoteCheerioExtractor, fsItemsRepo)

const url = 'nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230107110635000271651060000638791220983458&Token=F8F7A2D1C38876E554D0028FBBE180E8'
uploadFiscalNoteUsecase.exec(url)