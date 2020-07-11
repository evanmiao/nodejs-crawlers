const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // 目标页面 url
  let url = 'https://movie.douban.com/top250?start='

  // 定义爬取函数
  async function main(url) {
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })

    return await page.$$eval('div.item', elements => {
      return elements.map(v => {
        let img = $(v).find('.pic a img').attr('src')
        let title = $(v).find('.hd .title:first-child').text()
        let info = $(v).find('.bd p:first-child').text().split('\n')[2]
        let rete = $(v).find('.bd .star .rating_num').text()
        let summary = $(v).find('.bd .quote .inq').text()
        return {
          img,
          title,
          year: info.split('/')[0].trim(),
          region: info.split('/')[1].trim(),
          type: info.split('/')[2].trim(),
          rete,
          summary
        }
      })
    })
  }

  let data = []

  // 翻页
  for (let i = 0; i < 250; i += 25) {
    let res = await main(url + i)
    data.push(...res)
  }

  // 存储数据
  fs.writeFileSync(path.join(__dirname, '../results/top250.json'), JSON.stringify(data))

  await browser.close()
})()