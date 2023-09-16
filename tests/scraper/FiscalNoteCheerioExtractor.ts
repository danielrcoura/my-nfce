import cheerio, { CheerioAPI } from 'cheerio'
import FiscalNoteExtractor from "../../src/scraper/FiscalNoteExtractor";
import FiscalNote from '../../src/domain/entities/FiscalNote';

export default class FiscalNoteCheerioExtractor implements FiscalNoteExtractor {
    extract(html: Buffer): FiscalNote {
        const $ = cheerio.load(html);
        const date = this.extractDate($)
        const table = this.extractTable($)
        const cleanedTable = this.cleanTable(table)
        return this.createFiscalNote(cleanedTable, date)
    }

    private extractTable($: CheerioAPI): string[][] {
        const tableElement = $('#tbItensList')
        const rows = tableElement.find('tr');
        
        const table: string[][] = [];

        rows.each((i, element) => {
            const columns = $(element).find('td');
            const rowData = columns.map((i, column) => $(column).text()).get();
            table.push(rowData);
        });

        return table
    }

    private cleanTable(table: string[][]) {
        let cleanedTable = table.map(row => {
            return row.map(item => {
                const cleanedString = item.replace(/^\s+/g, '');
                return cleanedString
            })
        })
        cleanedTable = cleanedTable.map(row => row.slice(1))
        cleanedTable = cleanedTable.slice(1)
        return cleanedTable
    }

    private extractDate($: CheerioAPI): Date {
        const rawDate = $('#lblDataEmissao').text()
        const cleanedDate = rawDate.replace(/Data de Emissão: /g, '').replace(/\s$/, '')
        const [datePart, timePart] = cleanedDate.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = timePart.split(":");

        const result = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`
        return new Date(result)
    }

    private createFiscalNote(table: string[][], date: Date): FiscalNote {
        const items = table.map(row => {
            const item = {
                name: row[1],
                quantity: parseFloat(row[2].replace(',', '.')),
                unit: row[3],
                price: parseFloat(row[5].replace(',', '.')),
            }
            return item
        })
        return new FiscalNote(date, items)
    }
}