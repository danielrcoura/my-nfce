import TelegramBot from 'node-telegram-bot-api';
import UploadFiscalNoteUsecase from "../domain/usecases/UploadFiscalNote";
import FiscalNoteCheerioExtractor from "../scraper/FiscalNoteCheerioExtractor";
import FiscalNotePupepeteerFetcher from "../scraper/FiscalNotePuppeteerFetcher";
import MyFiscalNoteScraper from "../scraper/MyFiscalNoteScraper";
import RawFiscalNoteStorageS3 from '../storage/RawFiscalNoteStorageS3';
import ItemsKnexRepo from '../items-repo/ItemsKnexRepo';
import config from '../config';

const bot = new TelegramBot(config.telegramToken, {polling: true});

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
