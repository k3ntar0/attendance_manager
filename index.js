'use strict'

const line = require('@line/bot-sdk')
const express = require('express')
require('dotenv').config()

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}

// create LINE SDK client
const client = new line.Client(config)

// create Express app
// about Express itself: https://expressjs.com/
const app = express()

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err)
            res.status(500).end()
        })
})

// event handler
function handleEvent(event) {
    if (event.type !== 'message') {
        // ignore non-text-message event
        return Promise.resolve(null)
    }

    if (event.message.type == 'text') {
        // create a echoing text message
        const echo = {
            type: 'text',
            text: event.message.text
        }

        // use reply API
        return client.replyMessage(event.replyToken, echo)
    } else if (event.message.type == 'location') {
        // create a echoing text message
        const echo = {
            type: 'text',
            text: event.message.address
        }

        // use reply API
        return client.replyMessage(event.replyToken, echo)
    }
}

// listen on port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`listening on ${port}`)
})