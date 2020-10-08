'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '147f66eec336929a1a4e119e9991b91a',
    channelAccessToken: 'R4/16oirNPF12tsUUyQAKB0CFOq3FathMhg1YGhJqwKWgnz1iqeqlBvC3azyqqufIR27/cY2zr/mw5fymS1a8mqyfd3Ng7EbMRH/W9BghKhTLjbTRW2d0P+l+CMGEa+rbvPctpEIUKfmjglbqgN7ygdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return;
    }

    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text //実際に返信の言葉を入れる箇所
    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

// app.listen(PORT);
// console.log(`Server running at ${PORT}`);
(process.env.NOW_REGION) ? module.exports = app: app.listen(PORT);
console.log(`Server running at ${PORT}`);