const puppeteer = require('puppeteer')
const path = require('path')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://es6.ruanyifeng.com/#README')
  await page.waitFor(2000)

  async function print(a) {
    await page.goto(a.href)
    await page.waitFor(2000)
    await page.pdf({
      path: path.join(__dirname, `../results/${a.name}.pdf`)
    })
  }

  // 左侧导航栏链接的 href、title 信息
  let aTags = await page.$$eval('ol li a', el => {
    return el.map(a => {
      return {
        href: a.href.trim(),
        name: a.text
      }
    })
  })

  for (let i = 0; i < aTags.length; i++) {
    await print(aTags[i])
  }

  await browser.close()
})()