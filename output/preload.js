const fs = require('node:fs')
const path = require('node:path')

// 在uTools环境中直接挂载API到window对象
if (typeof utools !== 'undefined') {
  // 创建安全的数据目录路径
  const getDataPath = () => {
    return path.join(utools.getPath('appData'), 'compound-calculator')
  }

  // 初始化数据目录
  if (!fs.existsSync(getDataPath())) {
    fs.mkdirSync(getDataPath(), { recursive: true })
  }

  // 复利计算函数
  const calculateCompoundInterest = (params) => {
    const { principal, rate, years, monthlyInvestment = 0 } = params
    const monthlyRate = rate / 100 / 12
    const totalMonths = years * 12
    let balance = principal
    const result = []

    for (let i = 0; i < totalMonths; i++) {
      const startBalance = balance
      const interest = balance * monthlyRate
      balance = balance + interest + monthlyInvestment
      
      result.push({
        period: i + 1,
        time: new Date().setMonth(new Date().getMonth() + i),
        startBalance: parseFloat(startBalance.toFixed(2)),
        investment: monthlyInvestment,
        interest: parseFloat(interest.toFixed(2)),
        endBalance: parseFloat(balance.toFixed(2))
      })
    }
    
    return result
  }

  // 直接挂载API到window对象
  window.compoundAPI = {
    calculate: calculateCompoundInterest,
    readFile: (filename) => {
      const safePath = path.join(getDataPath(), path.basename(filename))
      if (fs.existsSync(safePath)) {
        return fs.readFileSync(safePath, 'utf-8')
      }
      return null
    },
    writeFile: (filename, data) => {
      const safePath = path.join(getDataPath(), path.basename(filename))
      fs.writeFileSync(safePath, data)
      return safePath
    },
    exportCSV: (data) => {
      const csv = [
        '期数,时间,期初余额,投入,利息,期末余额',
        ...data.map(row => Object.values(row).join(','))
      ].join('\n')
      const exportPath = path.join(getDataPath(), `compound_${Date.now()}.csv`)
      fs.writeFileSync(exportPath, csv)
      return exportPath
    }
  }

  // uTools生命周期事件
  utools.onPluginReady(() => {
    console.log('复利计算器插件已初始化')
  })

  utools.onPluginEnter(({ code }) => {
    console.log('插件功能激活:', code)
  })

  utools.onPluginOut(() => {
    console.log('插件退出')
  })
} else {
  console.error('uTools环境未正确初始化！')
}