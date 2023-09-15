import FiscalNote, { ItemsPrices } from "../entities/FiscalNote";
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
    const oldItemsPrices = this.getOldItemsPrices(fiscalNote, months)
    
    const {
      variationRate: productsVariationRate,
      missing
    } = this.calculateProductsVariation(fiscalNote.getItemsPrices(), oldItemsPrices)
    
    const {
      variation,
      variationRate
    } = this.calculateFiscalNoteVariation(fiscalNote, oldItemsPrices, missing)

    return { variation, variationRate, productsVariationRate, missing }
  }

  getOldItemsPrices(fiscalNote: FiscalNote, months: number): ItemsPrices {
    const itemsNames = fiscalNote.items.map(i => i.name)
    const oldDate = this.subtractMonths(fiscalNote.date, months)
    const oldItemsPrices = this.itemsRepo.getMonthMedianItemsPrices(itemsNames, oldDate)
    return oldItemsPrices
  }

  subtractMonths(date: Date, months: number): Date {
    const dateCopy = new Date(date);
    dateCopy.setMonth(dateCopy.getMonth() - months);
    return dateCopy;
  }

  calculateProductsVariation(itemsPrices: ItemsPrices, oldItemsPrices: ItemsPrices) {
    const missing: string[] = []
    let oldTotal = 0
    let newTotal = 0

    Object.entries(itemsPrices).forEach(([name, price]) => {
      if (oldItemsPrices[name]) {
        oldTotal += oldItemsPrices[name]
        newTotal += price
      } else {
        missing.push(name)
      }
    })

    const variation = newTotal - oldTotal
    const variationRate = variation / oldTotal

    return { variationRate, missing }
  }

  calculateFiscalNoteVariation(fiscalNote: FiscalNote, oldItemsPrices: ItemsPrices, missing: string[]) {
    let oldTotal = 0
    let newTotal = 0

    fiscalNote.items.forEach(item => {
      if (!missing.includes(item.name)) {
        oldTotal += item.quantity * oldItemsPrices[item.name]
        newTotal += item.quantity * item.price
      }
    })

    const variation = newTotal - oldTotal
    const variationRate = variation / oldTotal

    return { variation, variationRate }
  }
}