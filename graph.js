const fs = require('fs')

const TICKET = 'CARNE BOV COXAO DURO KG'

const raw = fs.readFileSync('data/result.json')
const tickets = JSON.parse(raw)

const filtered = tickets.filter(t => t.description === TICKET)
const sorted = filtered.sort((a, b) => {
    return (new Date(a)) > (new Date(b))
})

const formatted = sorted.map(t => {
    return {
		x: (new Date(t.date)).valueOf(),
		o: t.unitValue,
		h: t.unitValue,
		l: t.unitValue,
		c: t.unitValue
	};
})

console.log(formatted)