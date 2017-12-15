#!/usr/local/bin/node

const createSsbParty = require('ssb-party');
const readline = require('readline');
const nativeMessage = require('chrome-native-messaging');

function getReplyFor(msg, sbot, cb) {
    switch (msg.cmd) {
        case "whoami":
            sbot.whoami((err, feed) => {
                cb(feed.id)
            })
        break;
        case "publish":
            sbot.publish(msg.data, (err, data) => {
                if (err) {
                    cb({ error: err, data: false });
                } else {
                    cb({ error: false, data: data });
                }
            })
        break;
    }
}

createSsbParty(function (err, sbot) {
    if (err) {
        console.error(err);
    }

    process.stdin
        .pipe(new nativeMessage.Input())
        .pipe(new nativeMessage.Transform(function (msg, push, done) {
            getReplyFor(msg, sbot, data => {
                push(data);
                done();
            });
        }))
        .pipe(new nativeMessage.Output())
        .pipe(process.stdout);
});