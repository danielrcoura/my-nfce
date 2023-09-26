import knex, { Knex } from "knex";
import FiscalNote, { Item, ItemsPrices } from "../domain/entities/FiscalNote";
import ItemsRepo from "../domain/interfaces/ItemsRepo";

// TODO: create a pool
// TODO: db.destroy()
const db = knex({
	client: 'postgresql',
	connection: {
		host: 'localhost',
		database: 'fiscal_note',
		user:     'postgres',
		password: 'postgres'
	},
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		directory: './migrations',
		tableName: 'knex_migrations'
	}
});

export default class ItemsKnexRepo implements ItemsRepo {
    getMonthMedianItemsPrices(items: string[], date: Date): ItemsPrices {
        throw new Error("Method not implemented.");
    }

    async save(fiscalNote: FiscalNote): Promise<void> {
		return db.transaction(async trx => {
			const itemsIds = await this.getOrCreateItems(trx, fiscalNote.items)
			const fiscalNoteId = await this.createFiscalNote(trx, fiscalNote)
			await this.createFiscalNoteItems(trx, fiscalNote, fiscalNoteId, itemsIds)
		})
	}
	
	private async getOrCreateItems(trx: Knex.Transaction, items: Item[]): Promise<Record<string, number>> {
		const promises = items.map(item => this.getOrCreateSingleItem(trx, item))
		const rows = await Promise.all(promises)
		const ids = rows.reduce((result, item) => {
			result[item.name] = item.id
			return result
		}, {})
		return ids
	}

	private async getOrCreateSingleItem(trx: Knex.Transaction, item: Item) {
		let result = await trx('item').where('name', item.name)
		if (result.length === 0) {
			result = await trx('item').insert({ name: item.name }, ['id', 'name'])
		}
		return result[0]
	}

	private async createFiscalNote(trx: Knex.Transaction, fiscalNote: FiscalNote): Promise<number> {
		const rows = await trx('fiscal_note').insert({
			key: fiscalNote.id,
			date: fiscalNote.date
		}, 'id')

		return (rows[0].id as number)
	}

	async createFiscalNoteItems(trx: Knex.Transaction, fiscalNote: FiscalNote, fiscalNoteId: number, itemsIds: Record<string, number>) {
		const fiscalNoteItems = fiscalNote.items.map(item => {
			return {
				fical_note_id: fiscalNoteId,
				item_id: itemsIds[item.name],
				price: item.price,
				quantity: item.quantity,
				unity: item.unit
			}
		})
		return trx('fiscal_note_item').insert(fiscalNoteItems)
	}
}