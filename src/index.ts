const line = require('@line/bot-sdk')
const Express = require('express')
require('dotenv').config()

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}

const client = new line.Client(config)
const app = Express()
const PORT = process.env.PORT

app.get('/', (_req, res) => {
    res.send(`
        <h1>TypeScript Express</h1>
    `)
})

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleEvent)).then((result) =>
        res.json(result),
    )
})

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null)
    }

    // create a echoing text message
    const echo = { type: 'text', text: event.message.text }

    // use reply API
    return client.replyMessage(event.replyToken, echo)
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})
