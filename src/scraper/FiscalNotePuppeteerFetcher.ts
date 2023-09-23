import FiscalNoteFetcher from './FiscalNoteFetcher'
import puppeteer, { Page } from 'puppeteer';
import { createWorker } from 'tesseract.js';
import Jimp from 'jimp';
import cheerio, { CheerioAPI } from 'cheerio'
import fs from 'fs'

export default class FiscalNotePupepeteerFetcher implements FiscalNoteFetcher {
    fetch(url: string): Promise<Buffer> {
        throw new Error('not implemented')
    }

    private async fetchCaptchaImage(cookies: string): Promise<Buffer> {
        const response = await fetch("http://nfce.set.rn.gov.br/portalDFE/JpegImage.aspx", {
            "headers": {
                "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "en-US,en;q=0.9",
                "cookie": cookies,
                "Referer": "http://nfce.set.rn.gov.br/portalDFE/NFCe/mDadosNFCeV2.aspx?chNFCe=24230807110635000271651060000777111415276276&Token=F39FA0A3E5B0AFA8AA6BC7457FD356CF",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        const arrayBuffer = await response.arrayBuffer()
        return Buffer.from(arrayBuffer)
    }

    private async breakWithTesseract(image: Buffer) {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({tessedit_char_whitelist: '0123456789'});
        const result = await worker.recognize(image);
        worker.terminate();
        return result.data.text;
    }

    private async fetchPage(url: string, captcha: string, viewState: string, eventValidation: string, cookies: string): Promise<string> {
        // const body = `__VIEWSTATE=${viewState}&__EVENTVALIDATION=${eventValidation}&txt_cod_antirobo=${captcha}&__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATEGENERATOR=CAFDC37D&__VIEWSTATEENCRYPTED=&btnVerDanfe=Ver+DANFE`
        const body = `__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=${encodeURIComponent(viewState)}&__VIEWSTATEGENERATOR=CAFDC37D&__VIEWSTATEENCRYPTED=&__EVENTVALIDATION=${encodeURIComponent(eventValidation)}&txt_cod_antirobo=${captcha}&btnVerDanfe=Ver+DANFE`
        console.log(body)
        console.log(cookies)
        const response = await fetch(url, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": cookies,
                "Referer": url,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": body,
            "method": "POST"
        });

        const file = await response.text()
        return file
    }

    private async verifyCaptcha(page: Page, captcha: string) {
        await page.evaluate(async (captcha) => {
            const input = document.querySelector('#txt_cod_antirobo') as HTMLInputElement
            input!.value = captcha;
            const button = document.querySelector('#btnVerDanfe') as HTMLButtonElement
            button.click()
        }, captcha)
        await page.screenshot({ path: 'captcha-screenshot.jpg' })
    }

    private async improveImage(image: Buffer): Promise<Buffer> {
        const resultBuffer = await new Promise<Buffer>((resolve) => {
            Jimp.read(image, async (err, newImage) => {
                // newImage.crop(20, 20, 20, 20)
                newImage.crop(30, 5, 140, 40)
                newImage.grayscale()
                newImage.resize(600, 150)

                const targetColor = {r: 255, g: 255, b: 255, a: 255};  // Color you want to replace
                const replaceColor = {r: 255, g: 255, b: 255, a: 255};  // Color you want to replace with
                const threshold = 50;  // Replace colors under this threshold. The smaller the number, the more specific it is.
                const focusTargetColor = {r: 0, g: 0, b: 0, a: 255};  // Color you want to replace with
                const focusReplaceColor = {r: 70, g: 70, b: 70, a: 255};  // Color you want to replace with
                const focusThreshold = 350;  // Replace colors under this threshold. The smaller the number, the more specific it is.
                const colorDistance = (c1: any, c2: any) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
                newImage.scan(0, 0, newImage.bitmap.width, newImage.bitmap.height, (x, y, idx) => {
                    const thisColor = {
                    r: newImage.bitmap.data[idx + 0],
                    g: newImage.bitmap.data[idx + 1],
                    b: newImage.bitmap.data[idx + 2],
                    a: newImage.bitmap.data[idx + 3]
                    };
                    if((colorDistance(targetColor, thisColor) <= threshold)) {
                    newImage.bitmap.data[idx + 0] = replaceColor.r;
                    newImage.bitmap.data[idx + 1] = replaceColor.g;
                    newImage.bitmap.data[idx + 2] = replaceColor.b;
                    newImage.bitmap.data[idx + 3] = replaceColor.a;
                    }
                    if((colorDistance(focusTargetColor, thisColor) <= focusThreshold)) {
                    newImage.bitmap.data[idx + 0] = focusReplaceColor.r;
                    newImage.bitmap.data[idx + 1] = focusReplaceColor.g;
                    newImage.bitmap.data[idx + 2] = focusReplaceColor.b;
                    newImage.bitmap.data[idx + 3] = focusReplaceColor.a;
                    }
                });

                newImage.blur(4)

                
            
            newImage.write("jimp.jpg"); // save
            const buffer = await newImage.getBufferAsync(Jimp.MIME_JPEG)
            resolve(buffer)
            })
        })
        return resultBuffer
    }

    private async breakCaptcha(url: string) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const cookies = await page.cookies()
        const viewState =  await page.$eval('#__VIEWSTATE', el => (el as HTMLInputElement).value);
        const eventValidation =  await page.$eval('#__EVENTVALIDATION', el => (el as HTMLInputElement).value);

        const parsedCookies = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
        const image = await this.fetchCaptchaImage(parsedCookies)
        const improvedImage = await this.improveImage(image)
        const captcha = await this.breakWithTesseract(improvedImage)

        const cleanedCaptcha = captcha.replace(/\s/g, '')
        await this.verifyCaptcha(page, cleanedCaptcha)
        
        browser.close();
        const html = await this.fetchPage(url, cleanedCaptcha, viewState, eventValidation, parsedCookies)
        fs.writeFileSync('index.html', html)
        const $ = cheerio.load(html)
        const tableExists = $('#tbItensList').length
        console.log(tableExists)
    }

    async init(url: string) {        
        const captcha = await this.breakCaptcha(url)
        // return this.fetchPage(url, captcha)
    }
}
