const express = require('express')
const app = express()
const port = 3001

process.on('unhandledRejection', (error) => {
    // Prevent that Node.js crashes on unhandled promise rejections
    console.error('Unhandled rejection:', error);
});

const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
let counter = 0;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async (req, res) => {
    try {
        sleep(1000).then(() => {
            // Force an unhandled promise rejection
            // This shouldn't crash Node.js
            throw new Error('This is a test error');
        });
        counter += 1;
        res.send('hello world ' + counter);
    } catch (err) {
        console.log(err);

        res.status(500);
        res.send('Error: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log(`Test at http://localhost:${port}`)
    console.log('After visiting the above page, the server will NOT crash after 1 second. The code is exactly the same as the one in with-sentry.js, but without Sentry middleware enabled.')
})
