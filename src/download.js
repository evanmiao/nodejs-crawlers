const puppeteer = require('puppeteer')
const fs = require('fs')

// 轮询判断文件是否存在
async function waitForFile(filePath) {
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      fs.stat(filePath, (err, stat) => {
        if (stat && stat.isFile()) {
          clearInterval(timer)
          resolve(stat)
        }
      })
    }, 200)
  })
}

;(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()

  await page.goto('https://cn.vuejs.org/v2/guide/installation.html')

  // 通过 CDP 会话设置下载路径
  const cdp = await page.target().createCDPSession()
  await cdp.send('Page.setDownloadBehavior', {
    behavior: 'allow', // 允许所有下载请求
    downloadPath: './results' // 设置下载路径
  })

  // 点击按钮触发下载
  const downloadBtn = await page.waitForSelector('div#downloads a.button:last-of-type')
  await downloadBtn.click()

  // 等待文件下载完成
  await waitForFile('./results/vue.min.js')

  await browser.close()
})()