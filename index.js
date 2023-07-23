const fs = require('fs')
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')
const slugify = require('slugify')

// const textIn = fs.readFileSync('./text/input.txt', 'utf-8')
// console.log(textIn)

// const textOut = `This is my name ${textIn}\ncreated on ${Date.now()}`
// fs.writeFileSync('./text/output.txt', textOut)
// console.log("text written!")

//Async operation 
// fs.readFile('./text/input.txt', 'utf-8', (err, data) => {
//     console.log(data)
// })
// console.log("Where i am 🫡")

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8',)
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8',)
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8',)
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8',)

const objData = JSON.parse(data)
const slug = objData.map((el) => slugify(el.productName, { lower: true }))
console.log(slug)
const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true)

    //Overview Page
    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, { 'Content-type': 'text/html' })
        const cardHtml = objData.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARD%}', cardHtml)
        res.end(output)

        //Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': "text/html" })
        const product = objData[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

        //API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'Hello',
        })
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000')
})
