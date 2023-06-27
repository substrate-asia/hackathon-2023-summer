import {FetchBalanceResult} from "@wagmi/core";

export function balanceStr(balance: FetchBalanceResult | undefined, decimalPlaces: number): string {
  if (!balance) {
    return ''
  }
  const num: number = parseFloat(balance.formatted)
  if (isNaN(num)) {
    return `${balance.formatted} ${balance.symbol}`
  }
  const roundedNum: string = num.toFixed(decimalPlaces);
  return `${roundedNum} ${balance.symbol}`
}
