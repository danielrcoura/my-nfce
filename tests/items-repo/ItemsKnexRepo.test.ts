import ItemsKnexRepo from '../../src/items-repo/ItemsKnexRepo'
import FiscalNote from '../../src/domain/entities/FiscalNote';

describe('ItemsKnexRepo', () => {
  xit('items repo', async () => {
    const itemsRepo = new ItemsKnexRepo()
    const fiscalNote = new FiscalNote('qwera22', new Date(), [
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
      {name: 'asdfasdf', price: 12, quantity: 1, unit: 'UN'},
    ])
    await itemsRepo.save(fiscalNote)
  });

  it('get items', async () => {
    const itemsRepo = new ItemsKnexRepo()
    const items = await itemsRepo.getItemTimeline(11)
    console.log(items)
  });
})
