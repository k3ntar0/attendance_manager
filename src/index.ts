require('dotenv').config()
import express from 'express'
const { GoogleSpreadsheet } = require('google-spreadsheet')

const app: express.Express = express()

// CORSの許可
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    )
    next()
})

// body-parserに基づいた着信リクエストの解析
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routingk
const router: express.Router = express.Router()

router.get('/read', (req: express.Request, res: express.Response) => {
    loadShiftPhoneNumbers()
        .then((numbers) => res.send(numbers))
        .catch((error) => res.send(error))
})

app.use(router)

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})

// Googleスプレッドシートからシフト情報をロードし、担当者の電話番号を取得
async function loadShiftPhoneNumbers() {
    // スプレッドシートIDと資格情報を用いてGoogleスプレッドシートをロード
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID)
    const credentials = require('./google-credentials.json')
    await doc.useServiceAccountAuth(credentials)
    await doc.loadInfo()

    //シフト情報を取得
    const shiftSheet = await doc.sheetsById[process.env.SHIFT_WORKSHEET_ID]
    const shiftRows = await shiftSheet.getRows()

    // 従業員情報を取得
    const staffSheet = await doc.sheetsById[process.env.STAFF_WORKSHEET_ID]
    const staffRows = await staffSheet.getRows()

    // シフト情報からDate列の値と指定した日付をロケール情報に基づいて取得
    let shiftRow = shiftRows.find(
        (row) =>
            new Date(row.Date).toLocaleDateString() ===
            new Date('2020/5/15').toLocaleDateString(),
    )

    // 元データ[ '5/15/2020', 'Mitsuharu', 'Yoshihiro' ]
    // Date列(最初の列)を取り除き、シフト担当の従業員を含む配列を取得する
    let employeesOnDuty = shiftRow._rawData.slice(1) // [ 'Mitsuharu', 'Yoshihiro' ]
    // 名前から電話番号の配列に置換
    employeesOnDuty = employeesOnDuty.map(
        (m) => staffRows.find((row) => row.Name === m).PhoneNumber,
    ) // [ '+815012341235', '+815012341237' ]

    return employeesOnDuty.join(',')
}

// // 実装した関数が正しく動作するかテスト

// router.post('/post', (req: express.Request, res: express.Response) => {
//     res.send(req.body)
// })
