const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://music.163.com', {
    waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
  })

  // 打开登录窗口
  const loginMenu = await page.$('a.link.s-fc3')
  await loginMenu.click()

  // 切换其他登录模式
  const switchBtn = await page.waitForSelector('a.u-btn2.other')
  await switchBtn.click()

  // 勾选同意条款
  const agreeCheckbox = await page.$('input#j-official-terms')
  await agreeCheckbox.click()

  // 邮箱帐号登录
  const loginMethod = await page.$('div.u-alt ul li:nth-child(4)')
  await loginMethod.click()

  // 输入帐号密码
  const name = ''  // Your account
  await page.type('input#e', name, {
    delay: 0
  })

  const pwd = ''  // Your password
  await page.type('input#epw', pwd, {
    delay: 1
  })

  // 登录
  const loginBtn = await page.$('a.js-primary.u-btn2.u-btn2-2')
  await loginBtn.click()

  // 切换iframe
  const frame = page.frames().find(frame => frame.name() === 'contentFrame')

  // 签到
  const checkin = await frame.waitForSelector('a.sign.u-btn2.u-btn2-2')
  await checkin.click()

  await browser.close()
})()