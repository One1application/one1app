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
  setAllTransaction: () => {},
  CurrentTransactionPage: 1,
  TotalTransactionPages: 0,
  getNextTransactionPage: () => {},
  getPreviousTransactionPage: () => {},
  AllWithdrawals: [],
  setAllWithdrawals: () => {},
  CurrentWithdrawalPage: 1,
  TotalWithdrawalPages: 0,
  getNextWithdrawalPage: () => {},
  getPreviousWithdrawalPage: () => {},
});
