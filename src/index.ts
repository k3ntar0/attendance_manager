import * as Express from 'express'
require('dotenv').config()

const app = Express()
const PORT = process.env.PORT

app.get('/', (_req, res) => {
    res.send(`
        <h1>TypeScript Express</h1>
    `)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})
