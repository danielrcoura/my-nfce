import { ItemsPrices } from "../dto/ItemsPrices";
import FiscalNote from "../entities/FiscalNote";
import ItemsRepo from "../interfaces/ItemsRepo"

type Variation = {
  variation: number
  variationRate: number
  productsVariationRate: number
  missing: string[]
}

export default class CalculateFiscalNoteVartiationUsecase {
  constructor(private itemsRepo: ItemsRepo) { }

  exec(fiscalNote: FiscalNote, months: number): Variation {
    const itemsNames = fiscalNote.items.map(i => i.name)
    const oldDate = this.subtractMonths(fiscalNote.date, months)
    const oldItemsPrices = this.itemsRepo.getMonthMedianItemsPrices(itemsNames, oldDate)

    const { variationRate: productsVariationRate, missing } = this.calculateProductsVariation(fiscalNote, itemsNames, oldItemsPrices)
    const { variation, variationRate } = this.calculateFiscalNoteVariation(fiscalNote, oldItemsPrices, missing)

    return { variation, variationRate, productsVariationRate, missing }
  }

  subtractMonths(date: Date, months: number): Date {
    const dateCopy = new Date(date);
    dateCopy.setMonth(dateCopy.getMonth() - months);
    return dateCopy;
  }

  calculateProductsVariation(fiscalNote: FiscalNote, itemsNames: string[], oldItemsPrices: ItemsPrices) {
    const missing: string[] = []
    let oldTotal = 0
    let newTotal = 0

    itemsNames.forEach(item => {
      const oldItemPrice = oldItemsPrices.prices[item]
      if (oldItemPrice) {
        oldTotal += oldItemPrice
        newTotal += fiscalNote.items.find(i => i.name === item)?.price || 0
      } else {
        missing.push(item)
      }
    })

    const difference = newTotal - oldTotal
    const variationRate = difference / oldTotal

    return { variationRate, missing }
  }

  calculateFiscalNoteVariation(fiscalNote: FiscalNote, oldItemsPrices: ItemsPrices, missing: string[]) {
    let oldTotal = 0
    let newTotal = 0

    fiscalNote.items.forEach(item => {
      if (!missing.includes(item.name)) {
        oldTotal += item.quantity * oldItemsPrices.prices[item.name]
        newTotal += item.quantity * item.price
      }
    })

    const variation = newTotal - oldTotal
    const variationRate = variation / oldTotal

    return { variation, variationRate }
  }
}