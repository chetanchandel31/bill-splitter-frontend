type Args = {
  amount: number;
};

export const getFormattedCurrencyString = ({ amount }: Args): string => {
  const trimmedAmount: number = Number(amount.toFixed(2));

  // request a currency format
  const currencyString: string = trimmedAmount.toLocaleString("hi-IN", {
    style: "currency",
    currency: "INR",
  });

  return currencyString;
};
