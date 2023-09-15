import FiscalNote from '../../../src/domain/entities/FiscalNote';
import ItemsRepo from '../../../src/domain/interfaces/ItemsRepo';
import CalculateFiscalNoteVartiationUsecase from '../../../src/domain/usecases/CalculateFiscalNoteVariation';

describe('CalculateItemsVariation', () => {
  let calculateFiscalNoteVartiationUsecase: CalculateFiscalNoteVartiationUsecase
  let itemsRepo: ItemsRepo

  beforeEach(() => {
    const itemsRepo = { getMonthMedianItemsPrices: jest.fn() }
    calculateFiscalNoteVartiationUsecase = new CalculateFiscalNoteVartiationUsecase(itemsRepo);
  });

  it('should return the variation for a single product', () => {
    const fiscalNote = new FiscalNote(new Date('2023-02-01'), [
      { name: 'produto1', price: 10, quantity: 2, unit: 'UN' }
    ])

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({ 'produto1': 8 })

    const variation = calculateFiscalNoteVartiationUsecase.exec(fiscalNote, 1)
    expect(variation).toMatchObject({
      variation: 4,
      rate: 0.25,
      itemsVariationRate: 0.25,
      missingItems: []
    })
  });

  it('should return the variation for a multiple products', () => {
    const fiscalNote = new FiscalNote(new Date('2023-02-01'), [
      { name: 'produto1', price: 10, quantity: 2, unit: 'UN' },
      { name: 'produto2', price: 20, quantity: 100, unit: 'UN' },
    ])

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
      'produto1': 2,
      'produto2': 10
    })

    const variation = calculateFiscalNoteVartiationUsecase.exec(fiscalNote, 1)
    expect(variation).toMatchObject({
      variation: 1016,
      rate: 1.01,
      itemsVariationRate: 1.5,
      missingItems: []
    })
  });

  // xit('should return the variation for multiple products', () => {
  //   const itemsPrices = {
  //     date: new Date('2023-02-01'),
  //     prices: { 'produto1': 10, 'produto2': 5 }
  //   }

  //   itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
  //     date: new Date('2023-01-01'),
  //     prices: { 'produto1': 8, 'produto2': 2 }
  //   })

  //   const variation = calculateFiscalNoteVartiationUsecase.exec(itemsPrices, 1)
  //   expect(variation).toMatchObject({
  //     oldTotal: 10,
  //     newTotal: 15,
  //     variation: 5,
  //     percentage: 0.5,
  //     missing: []
  //   })
  // });

  // xit('should return the partial variation when there is no product to compare', () => {
  //   const itemsPrices = {
  //     date: new Date('2023-02-01'),
  //     prices: { 'produto1': 10, 'produto2': 5 }
  //   }

  //   itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
  //     date: new Date('2023-01-01'),
  //     prices: { 'produto1': 8 }
  //   })

  //   const variation = calculateFiscalNoteVartiationUsecase.exec(itemsPrices, 1)
  //   expect(variation).toMatchObject({
  //     oldTotal: 8,
  //     newTotal: 10,
  //     variation: 2,
  //     percentage: 0.25,
  //     missing: ['produto2']
  //   })
  // });

  // xit('should work when there is no product to compare', () => {
  //   const itemsPrices = {
  //     date: new Date('2023-02-01'),
  //     prices: { 'produto1': 10, 'produto2': 5 }
  //   }

  //   itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
  //     date: new Date('2023-01-01'),
  //     prices: { }
  //   })

  //   const variation = calculateFiscalNoteVartiationUsecase.exec(itemsPrices, 1)
  //   expect(variation).toMatchObject({
  //     oldTotal: 0,
  //     newTotal: 0,
  //     variation: 2,
  //     percentage: 0.25
  //   })
  // });

  // xit('should subtract month', () => {
  //   const itemsPrices = {
  //     date: new Date('2023-01-01'),
  //     prices: { 'produto1': 8 }
  //   }

  //   itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
  //     date: new Date('2023-12-01'),
  //     prices: { 'produto1': 8 }
  //   })

  //   calculateFiscalNoteVartiationUsecase.exec(itemsPrices, 1)
    
  //   expect(itemsRepo.getMonthMedianItemsPrices).toBeCalledWith(['produto1'], new Date('2022-12-02'))
  // });
})
