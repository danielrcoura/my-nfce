import TelegramBot from 'node-telegram-bot-api';
import UploadFiscalNoteUsecase, { UploadFiscalNoteResponse } from "../domain/usecases/UploadFiscalNote";
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

const capitalizeText = (text: string) => {
  return text
    .split(' ')
    .map(word => word.substring(0, 1).toUpperCase() + word.substring(1).toLocaleLowerCase())
    .join(' ')
}

const dateDiff = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}

const formatResponse = (response: UploadFiscalNoteResponse) => {
  const categories = response.categories
    .map(category => `${category.name}: ${category.total.toFixed(2)}`)
    .join('\n')
  const lastPrices = response.lastPrices
    .map(lastPrice => `${lastPrice.quantity}${lastPrice.unit} de ${capitalizeText(lastPrice.item)}\n${lastPrice.diff > 0 ? '📈 +' : '📉 '}${lastPrice.diff.toFixed(2)} (${dateDiff(response.fiscalNote.date, lastPrice.date)} dias)\n`)
    .join('\n')

  return `${categories}\n\n${lastPrices}`
}

bot.on('text', async (msg: any) => {
  const chatId = msg.chat.id;
  const text = msg.text
  if (text.includes('nfce.set.rn.gov.br')) {
    try{
      bot.sendMessage(chatId, 'Salvando nota fiscal...');
      const response = await uploadFiscalNoteUsecase.exec(text)
      const formattedResponse = formatResponse(response)
      bot.sendMessage(chatId, formattedResponse);
    } catch (e) {
      console.log(e)
      bot.sendMessage(chatId, `Erro no processamento da nota fiscal: ${e}`);
    }
  } else {
    bot.sendMessage(chatId, 'URL inválida');
  }

});
