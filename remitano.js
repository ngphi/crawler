const fs = require('fs')
const http = require('http')
const request = require('request')
const cheerio = require('cheerio')
const notifier = require('node-notifier')

const url = 'https://usdt.remitano.com/api/v1/offers?offer_type=sell&country_code=vn&coin_currency=usdt&offline=false&page=1'
const currency = 'USDT'
const interval = 60000
const max = 24000
let currentPrice = 0

console.log('Watching money...')
setInterval(crawlPrice, interval)

function crawlPrice() {
  request(url, function(error, response, body){
    if(error) throw error

    const newPriceInt = Number(JSON.parse(body).offers[0].price)

    if (!currentPrice || currentPrice < max && newPriceInt < currentPrice) {
      notifier.notify({
        icon: './tether-icon.png',
        title: currency,
        message: newPriceInt,
        sound: true, // Only Notification Center or Windows Toasters
      })
    }

    currentPrice = newPriceInt
  })
}
