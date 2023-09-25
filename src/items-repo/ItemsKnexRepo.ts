import knex from "knex";
import FiscalNote, { ItemsPrices } from "../domain/entities/FiscalNote";
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
    save(fiscalNote: FiscalNote): Promise<void> {
			console.log('saving...')
			return db('fiscal_note').insert({ key: fiscalNote.id, date: fiscalNote.date })
    }
    
}