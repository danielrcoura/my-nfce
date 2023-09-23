import FiscalNoteFetcher from './FiscalNoteFetcher'
import puppeteer, { Page } from 'puppeteer';
import { createWorker } from 'tesseract.js';

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

    private async verifyCaptcha(page: Page, captcha: string) {
        await page.evaluate(async (captcha) => {
            const input = document.querySelector('#txt_cod_antirobo') as HTMLInputElement
            input!.value = captcha;
            const button = document.querySelector('#btnVerDanfe') as HTMLButtonElement
            button.click()
        }, captcha)
        await page.screenshot({ path: 'captcha-screenshot.jpg' })
    }

    private async breakCaptcha(url: string): Promise<string> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const cookies = await page.cookies()
        const parsedCookies = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
        const image = await this.fetchCaptchaImage(parsedCookies)
        const captcha = await this.breakWithTesseract(image)
        const cleaned = captcha.replace(/\s/g, '')
        await this.verifyCaptcha(page, cleaned)
        browser.close();
        return cleaned
    }

    private async fetchPage(captcha: string) {
        console.log('my captcha:', captcha)
    }

    async init(url: string) {        
        const captcha = await this.breakCaptcha(url)
        return this.fetchPage(captcha)
    }
}
