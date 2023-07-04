import {FetchBalanceResult} from "@wagmi/core";

export function balanceStr(balance: FetchBalanceResult | undefined, fractionDigits: number): string {
  if (!balance) {
    return ''
  }
  const num: number = parseFloat(balance.formatted)
  if (isNaN(num)) {
    return `${balance.formatted} ${balance.symbol}`
  }
  const roundedNum: string = num.toFixed(fractionDigits);
  return `${roundedNum} ${balance.symbol}`
}
