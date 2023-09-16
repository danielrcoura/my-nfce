import fs from 'fs'
import FiscalNote, { Item, ItemsPrices } from "../domain/entities/FiscalNote";
import ItemsRepo from "../domain/interfaces/ItemsRepo";

type DbItem = {
    name: string,
    quantity: number,
    unit: string,
    price: number,
    date: string,
}

export default class FsItemsRepo implements ItemsRepo {
    getMonthMedianItemsPrices(items: string[], date: Date): ItemsPrices {
        const dbItems = this.getAll()

        const filtered = dbItems.filter(dbItem => {
            const dbItemDate = new Date(dbItem.date)
            return items.includes(dbItem.name)
                && dbItemDate.getMonth() === date.getMonth()
                && dbItemDate.getFullYear() === date.getFullYear()
        })

        const grouped = filtered.reduce((result, item) => {
            if (!result[item.name]) {
                result[item.name] = [item.price]
            } else {
                result[item.name].push(item.price)
            }
            return result
        }, {} as Record<string, number[]>)

        Object.values(grouped).forEach(prices => prices.sort())
        
        const medianPrices = Object.entries(grouped).reduce((result, [name, prices]) => {
            result[name] = prices[Math.ceil(prices.length / 2)]
            return result
        }, {} as ItemsPrices)

        return medianPrices
    }

    save(fiscalNote: FiscalNote): Promise<void> {
        const dbItems = this.getAll()
        const newData = fiscalNote.items.map(i => ({ ...i , date: fiscalNote.date.toISOString() }))
        dbItems.push(...newData)
        return fs.promises.writeFile(__dirname + '/database.json', JSON.stringify(dbItems, null, 2))
    }
    
    private getAll(): DbItem[] {
        const buffer = fs.readFileSync(__dirname + '/database.json')
        return JSON.parse(buffer.toString()) as DbItem[]
    }
}
