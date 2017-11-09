const fs = require('fs')
const http = require('http')
const request = require('request')
const cheerio = require('cheerio')
const notifier = require('node-notifier')

const url = 'https://exchangeno1.com/'
const currency = 'USDT'
const interval = 60000
const max = 26700
let currentPrice = 0

console.log('Watching money...')
setInterval(crawlPrice, interval)

function crawlPrice() {
  request(url, function(error, response, html){
    if(!error){
        const $ = cheerio.load(html)
        $(`#buy${currency}`).filter(function() {
          const price = $(this).text()
          const priceInt = Number(price.replace(',', ''))

          if (!currentPrice ||
            currentPrice < max && priceInt < currentPrice) {
            notifier.notify({
              icon: './tether-icon.png',
              title: currency,
              message: price,
              sound: true, // Only Notification Center or Windows Toasters
            })
            currentPrice = priceInt
          }
        })
    }
  })
}
