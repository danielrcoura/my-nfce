import TelegramBot from 'node-telegram-bot-api';
import UploadFiscalNoteUsecase from "../domain/usecases/UploadFiscalNote";
import FsItemsRepo from "../items-repo/FsItemsRepo";
import FiscalNoteCheerioExtractor from "../scraper/FiscalNoteCheerioExtractor";
import FiscalNotePupepeteerFetcher from "../scraper/FiscalNotePuppeteerFetcher";
import MyFiscalNoteScraper from "../scraper/MyFiscalNoteScraper";
import RawFiscalNoteStorageS3 from '../storage/RawFiscalNoteStorageS3';
import ItemsKnexRepo from '../items-repo/ItemsKnexRepo';

const token = '6516752254:AAENaVC3Udl_I-MAwdFV8qrKp0by7yojLQk';

const bot = new TelegramBot(token, {polling: true});

const itemsKnexRepo = new ItemsKnexRepo()
const fiscalNotePupepeteerFetcher = new FiscalNotePupepeteerFetcher()
const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()
const fiscalNoteScraper = new MyFiscalNoteScraper(fiscalNotePupepeteerFetcher, fiscalNoteCheerioExtractor)
const rawFiscalNoteStorageS3 = new RawFiscalNoteStorageS3()
const uploadFiscalNoteUsecase = new UploadFiscalNoteUsecase(fiscalNoteScraper, rawFiscalNoteStorageS3, itemsKnexRepo)

bot.on('text', async (msg: any) => {
  const chatId = msg.chat.id;
  const text = msg.text
  if (text.includes('nfce.set.rn.gov.br')) {
    console.log('fetching fiscal note...')
    await uploadFiscalNoteUsecase.exec(text)
    console.log('finished')
  }

  bot.sendMessage(chatId, JSON.stringify(msg));
});
