import { ItemsPrices } from "../dto/ItemsPrices";
import ItemsRepo from "../interfaces/ItemsRepo"

type Variation = {
    oldTotal: number
    newTotal: number
    variation: number
    percentage: number
    missing: string[]
}

export default class CalculateItemsVartiationUsecase {
    constructor(private itemsRepo: ItemsRepo) {}

    exec(itemsPrices: ItemsPrices, months: number): Variation {
        const itemsNames = Object.keys(itemsPrices.prices)
        const oldDate = this.subtractMonths(itemsPrices.date, months)
        const oldItemsPrices = this.itemsRepo.getMonthMedianItemsPrices(itemsNames, oldDate)
        
        const missing: string[] = []
        let oldTotal = 0
        let newTotal = 0

        itemsNames.forEach(item => {
            const oldItemPrice = oldItemsPrices.prices[item]
            if (oldItemPrice) {
                oldTotal += oldItemPrice
                newTotal += itemsPrices.prices[item]
            } else {
                missing.push(item)
            }
        })

        const variation = newTotal - oldTotal
        const percentage = variation / oldTotal

        return { oldTotal, newTotal, variation, percentage, missing }
    }

    subtractMonths(date: Date, months: number): Date {
        const dateCopy = new Date(date);
        dateCopy.setMonth(dateCopy.getMonth() - months);
        return dateCopy;
    }
}