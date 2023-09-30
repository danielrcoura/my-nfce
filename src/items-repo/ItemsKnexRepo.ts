import knex, { Knex } from "knex";
import FiscalNote, { Item, ItemsPrices } from "../domain/entities/FiscalNote";
import ItemsRepo, { CategoryTotal, ItemDataPoint } from "../domain/interfaces/ItemsRepo";
import config from "../config";

// TODO: create a pool
// TODO: db.destroy()
const db = knex({
	client: 'postgresql',
	connection: {
		host: config.dbHost,
		database: config.dbDatabase,
		user:     config.dbUser,
		password: config.dbPassword
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
		let result = await trx('item')
			.insert({ name: item.name })
			.onConflict(['name'])
			.ignore()
			.returning(['id', 'name'])
		
		if (result.length === 0) {
			result = await trx('item').where('name', item.name)
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
				fiscal_note_id: fiscalNoteId,
				item_id: itemsIds[item.name],
				price: item.price,
				quantity: item.quantity,
				unity: item.unit
			}
		})
		return trx('fiscal_note_item').insert(fiscalNoteItems)
	}

	async getItemTimeline(id: number): Promise<ItemDataPoint[]> {
		return db('fiscal_note_item')
			.join('fiscal_note', 'fiscal_note.id', 'fiscal_note_item.fiscal_note_id')
			.where('fiscal_note_item.item_id', id)
			.groupByRaw('1')
			.orderByRaw('1')
			.select(
				db.raw("date_trunc('day', fiscal_note.date) as date"), 
				db.raw("max(fiscal_note_item.price)")
			)
	}

	async summariseByCategory(key: string): Promise<CategoryTotal[]> {
		return db('fiscal_note')
			.join('fiscal_note_item', 'fiscal_note.id', 'fiscal_note_item.fiscal_note_id')
			.join('item', 'item.id', 'fiscal_note_item.item_id')
			.where('fiscal_note.key', key)
			.groupBy('item.category')
			.orderByRaw('2 desc')
			.select(
				"item.category as name", 
				db.raw('SUM(fiscal_note_item.price) as total')
			)
	}
}