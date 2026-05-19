const ETH_PRICE_KRW = 3_000_000; // approximate

export function weiToEth(wei: string | number): number {
  return Number(BigInt(wei.toString())) / 1e18;
}

export function weiToKrw(wei: string | number): number {
  return Math.round(weiToEth(wei) * ETH_PRICE_KRW);
}

export function formatWei(wei: string | number): string {
  const eth = weiToEth(wei);
  return `${eth.toFixed(4)} ETH`;
}

export function formatWeiAsKrw(wei: string | number): string {
  const krw = weiToKrw(wei);
  return `${krw.toLocaleString('ko-KR')}원`;
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
