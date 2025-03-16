import { createContext } from "react";

export const StoreContext = createContext({
  user: {},
  socials: [],
  header: [],
  links: [],
  setUser: () => {},
  setSocials: () => {},
  setHeader: () => {},
  setLinks: () => {},
  AllTransaction: [],
  CurrentTransactionPage: 0,
  TotalTransactionPages: 0,
  getNextTransactionPage: () => {},
  getPreviousTransactionPage: () => {},
  AllWithdrawals: [],
  CurrentWithdrawalPage: 0,
  TotalWithdrawalPages: 0,
  getNextWithdrawalPage: () => {},
  getPreviousWithdrawalPage: () => {},
});
