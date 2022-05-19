import { utils } from "near-api-js";

export function truncateAddress(address = "", width = 20) {
  if (address.length <= width) {
    return address;
  }
  if (!address) {
    return "";
  }
  return `${address.slice(0, width / 2)}...${address.slice(-width / 2)}`;
}

const {
  format: { formatNearAmount, parseNearAmount },
} = utils;
export const safeParseNearAmount = (amount) => {
  return amount !== undefined || amount !== null
    ? parseNearAmount(amount.toLocaleString("fullwide", { useGrouping: false }))
    : null;
};
export const safeFormatNearAmount = (amount) => {
  return amount !== undefined || amount !== null
    ? formatNearAmount(
        amount.toLocaleString("fullwide", { useGrouping: false })
      )
    : null;
};

export const roundToFourDec = (value) => {
  return Number(value)?.toFixed(4);
};
export const toLongNumber = (amount) => {
  return amount.toLocaleString("fullwide", { useGrouping: false });
};
