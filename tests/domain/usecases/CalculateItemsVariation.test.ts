import ItemsRepo from '../../../src/domain/interfaces/ItemsRepo';
import CalculateItemsVartiationUsecase from '../../../src/domain/usecases/CalculateItemsVariation'


describe('CalculateItemsVariation', () => {
  let calculateItemsVartiationUsecase: CalculateItemsVartiationUsecase
  let itemsRepo: ItemsRepo

  beforeEach(() => {
    itemsRepo = { getMonthMedianItemsPrices: jest.fn() }
    calculateItemsVartiationUsecase = new CalculateItemsVartiationUsecase(itemsRepo);
  });

  it('should return the variation for a single product', () => {
    const itemsPrices = {
      date: new Date('2023-02-01'),
      prices: { 'produto1': 10 }
    }

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
      date: new Date('2023-01-01'),
      prices: { 'produto1': 8 }
    })

    const variation = calculateItemsVartiationUsecase.exec(itemsPrices, 1)
    expect(variation).toMatchObject({
      oldTotal: 8,
      newTotal: 10,
      variation: 2,
      percentage: 0.25,
      missing: []
    })
  });

  it('should return the variation for multiple products', () => {
    const itemsPrices = {
      date: new Date('2023-02-01'),
      prices: { 'produto1': 10, 'produto2': 5 }
    }

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
      date: new Date('2023-01-01'),
      prices: { 'produto1': 8, 'produto2': 2 }
    })

    const variation = calculateItemsVartiationUsecase.exec(itemsPrices, 1)
    expect(variation).toMatchObject({
      oldTotal: 10,
      newTotal: 15,
      variation: 5,
      percentage: 0.5,
      missing: []
    })
  });

  it('should return the partial variation when there is no product to compare', () => {
    const itemsPrices = {
      date: new Date('2023-02-01'),
      prices: { 'produto1': 10, 'produto2': 5 }
    }

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
      date: new Date('2023-01-01'),
      prices: { 'produto1': 8 }
    })

    const variation = calculateItemsVartiationUsecase.exec(itemsPrices, 1)
    expect(variation).toMatchObject({
      oldTotal: 8,
      newTotal: 10,
      variation: 2,
      percentage: 0.25,
      missing: ['produto2']
    })
  });

  xit('should work when there is no product to compare', () => {
    const itemsPrices = {
      date: new Date('2023-02-01'),
      prices: { 'produto1': 10, 'produto2': 5 }
    }

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
      date: new Date('2023-01-01'),
      prices: { }
    })

    const variation = calculateItemsVartiationUsecase.exec(itemsPrices, 1)
    expect(variation).toMatchObject({
      oldTotal: 0,
      newTotal: 0,
      variation: 2,
      percentage: 0.25
    })
  });

  it('should subtract month', () => {
    const itemsPrices = {
      date: new Date('2023-01-01'),
      prices: { 'produto1': 8 }
    }

    itemsRepo.getMonthMedianItemsPrices = jest.fn().mockReturnValue({
      date: new Date('2023-12-01'),
      prices: { 'produto1': 8 }
    })

    calculateItemsVartiationUsecase.exec(itemsPrices, 1)
    
    expect(itemsRepo.getMonthMedianItemsPrices).toBeCalledWith(['produto1'], new Date('2022-12-02'))
  });
})
