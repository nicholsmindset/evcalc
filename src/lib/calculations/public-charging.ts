export interface ChargingQuote {
  ratePerKwh: number;
  sessionFee: number;
  monthlyFee: number;
}

export function compareChargingQuotes(kwhPerSession: number, sessions: number, a: ChargingQuote, b: ChargingQuote) {
  const cost = (quote: ChargingQuote) => {
    const session = kwhPerSession * quote.ratePerKwh + quote.sessionFee;
    return { session, month: session * sessions + quote.monthlyFee };
  };
  const optionA = cost(a);
  const optionB = cost(b);
  return { optionA, optionB, monthlyDifference: optionA.month - optionB.month };
}
