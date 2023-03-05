const router = require('express').Router();
const fs = require('node:fs/promises')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const dayjs = require('dayjs')
const { fetchJson, fetchJsonAll } = require('../util/fetchJson');
/**
 * パスはspendingでデータはspend
 */

// 月の入金額をすべて取得
router.get('/income', async (req, res, next) => {
    const data = await fetchJsonAll('income')
    res.status(200).json(data)
})
// 指定された月の入金額を取得
router.get('/income/:id', async (req, res, next) => {
    const filename = req.params.id
    const data = await fetchJson(filename)
    res.status(200).json(data)
})
// 月の入金額を追加
router.post('/income/add', async (req, res) => {
    const { incomeDescription, incomeCategory, incomeAmout, recievedDate } = req.body;
    // JSONファイル用のオブジェクトを作る
    const incomeData = {
        id: uuidv4(),
        incomeDescription: incomeDescription,
        incomeCategory: incomeCategory,
        incomeAmout: incomeAmout,
        recievedDate: recievedDate,
        createdAt: dayjs().format('YYYY-MM-DD'),
        updatedAt: dayjs().format('YYYY-MM-DD')
    }
    // JSONに書き込む
    const data = JSON.stringify(incomeData).toString()
    await fs.writeFile(`${__dirname}/../tmp/income/${incomeData.id}.json`, data)
    res.status(201).json({ messsage: '成功しました' })
})
// 月の入金額を更新
router.put('/income/update/:id', async (req, res, next) => {
    const filename = req.params.id
    const incomeData = await fetchJson(filename)
    const { incomeDescription, incomeCategory, incomeAmout, recievedDate } = req.body;
    incomeDescription && (incomeData.incomeDescription = incomeDescription)
    incomeCategory && (incomeData.incomeCategory = incomeCategory)
    incomeAmout && (incomeData.incomeAmout = incomeAmout)
    recievedDate && (incomeData.recievedDate = recievedDate)

    const data = JSON.stringify(incomeData).toString()
    await fs.writeFile(`${__dirname}/../tmp/income/${filename}.json`, data)

    res.status(200).json({ messsage: '更新されました' })
})
// 月の入金額を削除
router.delete('/income/delete/:id', async (req, res, next) => {
    const filename = req.params.id
    await fs.unlink(`${__dirname}/../tmp/income/${filename}.json`)
    res.status(200).json({ messsage: '削除されました' })
})
// 入金額の合計を取得（月の入金額の合計値）
router.get('/totalincome', async (req, res, next) => {
    const data = await fetchJsonAll('income')
    const result = data.map(value => value.incomeAmout).reduce((accu, curr) =>
        // accuにはarray[0]の値が入る
        accu + curr
    )
    res.status(200).json(result)
})


// 月の支出額のすべてを取得
router.get('/spending', async (req, res, next) => {
    const data = await fetchJsonAll('spending')
    res.status(200).json(data)
})
// 指定の月の支出額を取得
router.get('/spending/:id', async (req, res, next) => {
    const filename = req.params.id
    const data = await fetchJson('spending', filename)
    res.status(200).json(data)
})
// 月の支出額を追加
router.post('/spending/add', async (req, res) => {
    console.log(req.body)
    const { spendDescription, spendCategory, spendAmout, recievedDate } = req.body;
    // JSONファイル用のオブジェクトを作る
    const spendingData = {
        id: uuidv4(),
        spendDescription: spendDescription,
        spendCategory: spendCategory,
        spendAmout: spendAmout,
        recievedDate: recievedDate,
        createdAt: dayjs().format('YYYY-MM-DD'),
        updatedAt: dayjs().format('YYYY-MM-DD')
    }
    // JSONに書き込む
    const data = JSON.stringify(spendingData).toString()
    await fs.writeFile(`${__dirname}/../tmp/spending/${spendingData.id}.json`, data)
    res.status(201).json({ messsage: '成功しました' })
})
// 月の支出額を更新
router.put('/spending/update/:id', async (req, res, next) => {
    const filename = req.params.id
    const spendData = await fetchJson('spending', filename)
    const { spendDescription, spendCategory, spendAmout, recievedDate } = req.body;
    spendDescription && (spendData.spendDescription = spendDescription)
    spendCategory && (spendData.spendCategory = spendCategory)
    spendAmout && (spendData.spendAmout = spendAmout)
    recievedDate && (spendData.recievedDate = recievedDate)

    const data = JSON.stringify(spendData).toString()
    await fs.writeFile(`${__dirname}/../tmp/spending/${filename}.json`, data)

    res.status(200).json({ messsage: '更新されました' })
})
// 月の支出額を削除
router.delete('/spending/delete/:id', async (req, res, next) => {
    const filename = req.params.id
    await fs.unlink(`${__dirname}/../tmp/spending/${filename}.json`)
    res.status(200).json({ messsage: '削除されました' })
})
// 支出額の合計を取得（月の支出額の合計額）
router.get('/totalspending', async (req, res, next) => {
    const data = await fetchJsonAll('spending')
    const result = data.map(value => value.spendAmout).reduce((accu, curr) =>
        // accuにはarray[0]の値が入る
        accu + curr
    )
    res.status(200).json(result)
})

// 入金額 - 支出額の差額・残高を取得
router.get('/balance', async (req, res, next) => {
    const spenddata = await fetchJsonAll('spending')
    const totalSpend = spenddata.map(value => value.spendAmout).reduce((accu, curr) =>
        accu + curr
    )
    const incomedata = await fetchJsonAll('income')
    const totalIncome = incomedata.map(value => value.incomeAmout).reduce((accu, curr) =>
        accu + curr
    )
    const result = totalIncome - totalSpend
    res.status(200).json(result)
})

module.exports = router