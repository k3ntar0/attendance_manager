require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')

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

// 実装した関数が正しく動作するかテスト
loadShiftPhoneNumbers()
    .then((numbers) => console.log(numbers))
    .catch((error) => console.error(error))
