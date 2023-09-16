import FiscalNote, { ItemsPrices, FiscalNoteSummary } from "../entities/FiscalNote";
import ItemsRepo from "../interfaces/ItemsRepo"

type ItemVariation = {
  name: string
  variation: number
  rate: number
}

type Variation = {
  variation: number
  rate: number
  itemsVariation: ItemVariation[]
  missingItems: string[]
}

export default class CalculateFiscalNoteVartiationUsecase {
  constructor(private itemsRepo: ItemsRepo) { }

  exec(fiscalNote: FiscalNote, months: number): Variation {
    const oldItemsPrices = this.getOldItemsPrices(fiscalNote, months)
    const itemsVariation = this.calculateItemsVariation(fiscalNote.summary, oldItemsPrices)
    const { variation, rate } = this.calculateFiscalNoteVariation(fiscalNote, oldItemsPrices)
    const missingItems = this.getMissingItems(fiscalNote.summary, oldItemsPrices)

    return { variation, rate, itemsVariation, missingItems }
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

  calculateItemsVariation(fiscalNoteSummary: FiscalNoteSummary, oldItemsPrices: ItemsPrices): ItemVariation[] {
    const result: ItemVariation[] = []
    
    Object.entries(fiscalNoteSummary).forEach(([name, summary]) => {
      if (oldItemsPrices[name]) {
        const variation = summary.price - oldItemsPrices[name]
        const rate = variation / oldItemsPrices[name]
        result.push({ name, variation, rate })
      }
    })

    result.sort((a, b) => {
      const weightA = a.variation * fiscalNoteSummary[a.name].quantity
      const weightB = b.variation * fiscalNoteSummary[b.name].quantity
      return weightB - weightA
    })

    return result
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

  getMissingItems(fiscalNoteSummary: FiscalNoteSummary, oldItems: ItemsPrices): string[] {
    const oldItemsNames = Object.keys(oldItems)
    return Object.keys(fiscalNoteSummary).filter(name => !oldItemsNames.includes(name))
  }
}