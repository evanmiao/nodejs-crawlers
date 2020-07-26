const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://www.baidu.com')

  const soutuBtn = await page.waitForSelector('span.soutu-btn')
  await soutuBtn.click()

  const uploadPic = await page.$('input.upload-pic')
  await uploadPic.uploadFile('./image.png')  // 上传图片

  await page.waitForSelector('div.graph-guess-word')
  const graphGuessWord = await page.$eval('div.graph-guess-word', e => {
    return e.textContent.trim()
  })

  console.log(graphGuessWord)

  await browser.close()
})()