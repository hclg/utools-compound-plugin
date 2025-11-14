import { utools } from '@/types/utools'

const HISTORY_KEY = 'compound-calculator-history'

export interface CalculationRecord {
  id: string
  timestamp: number
  params: {
    principal: number
    rate: number
    years: number
    monthlyInvestment?: number
    compoundFrequency?: number
  }
  result: {
    finalAmount: number
    totalInterest: number
  }
}

export const saveCalculation = (record: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
  const newRecord: CalculationRecord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...record
  }
  
  const history = getHistory()
  history.unshift(newRecord)
  utools.dbStorage.setItem(HISTORY_KEY, history.slice(0, 1000)) // 限制1000条记录
}

export const getHistory = (): CalculationRecord[] => {
  return utools.dbStorage.getItem(HISTORY_KEY) || []
}

export const clearHistory = () => {
  utools.dbStorage.removeItem(HISTORY_KEY)
}