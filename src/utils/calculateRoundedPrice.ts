const calculateRoundedPrice = (
  number: number,
  isCompact = false,
  isCode = true
) => {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    currencyDisplay: isCode ? "code" : "narrowSymbol",
    notation: isCompact ? "compact" : "standard",
  }).format(number);
};

export default calculateRoundedPrice;
