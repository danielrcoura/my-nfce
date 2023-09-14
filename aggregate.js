const fs = require('fs')

const result = []
for (let i = 1; i <= 39; i++) {
    const raw = fs.readFileSync(`data/${i}.json`)
    const json = JSON.parse(raw)
    result.push(...json)
}

fs.writeFileSync(`data/result.json`, JSON.stringify(result, null, 2))