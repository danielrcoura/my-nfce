import cheerio from 'cheerio'
import FiscalNoteExtractor from "../domain/interfaces/FiscalNoteExtractor";

export default class FiscalNoteCheerioExtractor implements FiscalNoteExtractor {
    extract(html: Buffer) {
        const $ = cheerio.load(html);
        const table = $('#tbItensList')
        const rows = table.find('tr');

        const tableData: any[][] = [];

        rows.each((index, element) => {
            const columns = $(element).find('td');
            const rowData = columns.map((i, column) => $(column).text()).get();
            tableData.push(rowData);
        });

        let cleanedTable = tableData.map(row => {
            return row.map(item => {
                const cleanedString = (item as string).replace(/^\s+/g, '');
                return cleanedString
            })
        })
        cleanedTable = cleanedTable.map(row => row.slice(1))
        cleanedTable = cleanedTable.slice(1)

        function getDate () {
            const rawDate = $('#lblDataEmissao').text()
            const cleanedDate = rawDate.replace(/Data de Emissão: /g, '').replace(/\s$/, '')
            const [datePart, timePart] = cleanedDate.split(" ");
            const [day, month, year] = datePart.split("/");
            const [hours, minutes, seconds] = timePart.split(":");

            const result = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`
            return result
        }
        const resultWithDate: any[] = cleanedTable.map(row => [...row, getDate()])

        const formattedNumbers = resultWithDate.map(row => {
            row[2] = parseFloat(row[2].replace(',', '.'))
            row[4] = parseFloat(row[4].replace(',', '.'))
            row[5] = parseFloat(row[5].replace(',', '.'))
            return row
        })

        const result = formattedNumbers.reduce((result, item) => {
            result.push({
                item: item[0],
                description: item[1],
                quantity: item[2],
                unit: item[3],
                unitValue: item[4],
                totalValue: item[5],
                date: item[6],
            })
            return result
        }, [])

        return result
    }
}