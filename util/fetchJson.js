const fs = require('node:fs/promises')
const path = require('path')

const fetchJsonAll = async (dir) => {
    let rowdata;
    let filedata = [];
    const files = (await fs.readdir(`${__dirname}/../tmp/${dir}`))
        .filter(file => path.extname(file) === '.json')
    for await (const file of files) {
        rowdata = await fs.readFile(`${__dirname}/../tmp/${dir}/${file}`, 'utf8').then(JSON.parse)
        filedata.push(rowdata)
    }
    return filedata
}
const fetchJson = async (dir, filename) => {
    return await fs.readFile(`${__dirname}/../tmp/${dir}/${filename}.json`, 'utf8').then(JSON.parse)
}

module.exports = { fetchJson, fetchJsonAll }