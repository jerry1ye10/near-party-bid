import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  utils,
} from "near-api-js";

export function truncateAddress(address = "", width = 10) {
  if (!address) {
    return "";
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
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
