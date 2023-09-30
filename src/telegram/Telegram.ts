import TelegramBot from 'node-telegram-bot-api';
import UploadFiscalNoteUsecase from "../domain/usecases/UploadFiscalNote";
import FiscalNoteCheerioExtractor from "../scraper/FiscalNoteCheerioExtractor";
import FiscalNotePupepeteerFetcher from "../scraper/FiscalNotePuppeteerFetcher";
import MyFiscalNoteScraper from "../scraper/MyFiscalNoteScraper";
import RawFiscalNoteStorageS3 from '../storage/RawFiscalNoteStorageS3';
import ItemsKnexRepo from '../items-repo/ItemsKnexRepo';
import config from '../config';
import { CategoryTotal } from '../domain/interfaces/ItemsRepo';

const bot = new TelegramBot(config.telegramToken, {polling: true});

const itemsKnexRepo = new ItemsKnexRepo()
const fiscalNotePupepeteerFetcher = new FiscalNotePupepeteerFetcher()
const fiscalNoteCheerioExtractor = new FiscalNoteCheerioExtractor()
const fiscalNoteScraper = new MyFiscalNoteScraper(fiscalNotePupepeteerFetcher, fiscalNoteCheerioExtractor)
const rawFiscalNoteStorageS3 = new RawFiscalNoteStorageS3()
const uploadFiscalNoteUsecase = new UploadFiscalNoteUsecase(fiscalNoteScraper, rawFiscalNoteStorageS3, itemsKnexRepo)

const formatResponse = (categories: CategoryTotal[]) => {
  const result = categories.map(category => `${category.name}: ${category.total.toFixed(2)}`)
  return result.join('\n')
}

bot.on('text', async (msg: any) => {
  const chatId = msg.chat.id;
  const text = msg.text
  if (text.includes('nfce.set.rn.gov.br')) {
    try{ 
      const categories = await uploadFiscalNoteUsecase.exec(text)
      const response = formatResponse(categories)
      bot.sendMessage(chatId, response);
    bot.sendMessage(chatId, 'URL inválida');
    } catch (e) {
      bot.sendMessage(chatId, `Erro no processamento da nota fiscal: ${e}`);
    }
  } else {
    bot.sendMessage(chatId, 'URL inválida');
  }

});
