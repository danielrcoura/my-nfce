import FiscalNote, { ItemsPrices } from "../entities/FiscalNote";
import ItemsRepo from "../interfaces/ItemsRepo"

type Variation = {
  variation: number
  rate: number
  itemsVariationRate: number
  missingItems: string[]
}

export default class CalculateFiscalNoteVartiationUsecase {
  constructor(private itemsRepo: ItemsRepo) { }

  exec(fiscalNote: FiscalNote, months: number): Variation {
    const oldItemsPrices = this.getOldItemsPrices(fiscalNote, months)
    const itemsVariationRate = this.calculateProductsVariationRate(fiscalNote.getItemsPrices(), oldItemsPrices)
    const { variation, rate } = this.calculateFiscalNoteVariation(fiscalNote, oldItemsPrices)
    const missingItems = this.getMissingItems(fiscalNote.getItemsPrices(), oldItemsPrices)

    return { variation, rate, itemsVariationRate, missingItems }
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

  calculateProductsVariationRate(itemsPrices: ItemsPrices, oldItemsPrices: ItemsPrices): number {
    let oldTotal = 0
    let newTotal = 0

    Object.entries(itemsPrices).forEach(([name, price]) => {
      if (oldItemsPrices[name]) {
        oldTotal += oldItemsPrices[name]
        newTotal += price
      }
    })

    const variation = newTotal - oldTotal
    const rate = variation / oldTotal

    return rate
  }

  calculateFiscalNoteVariation(fiscalNote: FiscalNote, oldItemsPrices: ItemsPrices) {
    let oldTotal = 0
    let newTotal = 0

    fiscalNote.items.forEach(item => {
      if (oldItemsPrices[item.name]) {
        oldTotal += item.quantity * oldItemsPrices[item.name]
        newTotal += item.quantity * item.price
      }
    })

    const variation = newTotal - oldTotal
    const rate = variation / oldTotal

    return { variation, rate }
  }

  getMissingItems(itemsPrices: ItemsPrices, oldItems: ItemsPrices): string[] {
    const oldItemsNames = Object.keys(oldItems)
    return Object.keys(itemsPrices).filter(name => !oldItemsNames.includes(name))
  }
}