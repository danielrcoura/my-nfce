import fs from 'fs'
import FiscalNoteFetcher from './FiscalNoteFetcher'

const BASE_DIR='/home/satoshi/Documents/mercado-exchange/raw-notes'

export default class FiscalNoteFsFetcher implements FiscalNoteFetcher {
    fetch(url: string): Promise<Buffer> {
        const nfceId = this.getNfceId(url)
        const path = `${BASE_DIR}/${nfceId}.html`
        return fs.promises.readFile(path)
    }

    private getNfceId(url: string): string {
        const queryParams = url.split('?')[1]
        const nfceParam = queryParams.split('&')[0]
        const nfceId = nfceParam.split('=')[1]
        
        if (nfceId.length !== 44) {
            throw new Error('Error when getting the nfce id')
        }

        return nfceId
    }
}