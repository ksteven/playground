var wm = require('web-monitoring')
var options =
{
    whileControl: (oldPage, newPage) => oldPage === newPage,
    percentageDiff: 0.1
}

const express = require('express');
const app = express();

app.get('/monitor', (req, res) => {
    var wp = wm.monitor('http://www.google.com', options)
        .start()
        .on('start', (url) => console.log(`monitoring of '${url}' start`))
        .on('alert', (url, page) => {
            console.log('page changed');
            res.send(page);
            //wp.stop()
        })
        .on('check', (oldPage, newPage) => {
        })
        .on('error', (err) => console.log(error))
});

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

app.listen(3000, () => console.log('Gator app listening on port 3000!'));

