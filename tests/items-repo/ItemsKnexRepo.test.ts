import ItemsKnexRepo from '../../src/items-repo/ItemsKnexRepo'
import FiscalNote from '../../src/domain/entities/FiscalNote';

describe('ItemsKnexRepo', () => {
  it('items repo', async () => {
    const itemsRepo = new ItemsKnexRepo()
    const fiscalNote = new FiscalNote('231221311124', new Date(), [
        {name: 'sdf', price: 12, quantity: 1, unit: 'UN'},
        {name: 'asdf', price: 12, quantity: 1, unit: 'UN'},
        {name: 'asasdfdf', price: 12, quantity: 1, unit: 'UN'},
        {name: 'asasdfdf', price: 12, quantity: 1, unit: 'UN'},
    ])
    await itemsRepo.save(fiscalNote)
  });
})
