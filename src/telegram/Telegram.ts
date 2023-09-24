import TelegramBot from 'node-telegram-bot-api';
import UploadFiscalNoteUsecase from "../domain/usecases/UploadFiscalNote";
import FsItemsRepo from "../items-repo/FsItemsRepo";
import FiscalNoteCheerioExtractor from "../scraper/FiscalNoteCheerioExtractor";
import FiscalNotePupepeteerFetcher from "../scraper/FiscalNotePuppeteerFetcher";
import MyFiscalNoteScraper from "../scraper/MyFiscalNoteScraper";


const token = '6516752254:AAENaVC3Udl_I-MAwdFV8qrKp0by7yojLQk';

const bot = new TelegramBot(token, {polling: true});

const fsItemsRepo = new FsItemsRepo()
const fiscalNotePupepeteerFetcher = new FiscalNotePupepeteerFetcher()
const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()
const fiscalNoteScraper = new MyFiscalNoteScraper(fiscalNotePupepeteerFetcher, fiscalNoteCheerioExtractor)
const uploadFiscalNoteUsecase = new UploadFiscalNoteUsecase(fiscalNoteScraper, fsItemsRepo)

bot.on('text', async (msg: any) => {
  const chatId = msg.chat.id;
  const text = msg.text
  if (text.includes('nfce.set.rn.gov.br')) {
    await uploadFiscalNoteUsecase.exec(text)
  }

  bot.sendMessage(chatId, JSON.stringify(msg));
});
