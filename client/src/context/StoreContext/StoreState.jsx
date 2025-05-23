import { useCallback, useContext, useReducer, useState } from "react";
import { StoreContext } from "./StoreContext.jsx";
import { reducer } from "./StoreReducer.jsx";
import { SET_USER, SET_SOCIALS, SET_HEADER, SET_LINKS } from "./constants.js";
import {
  fetchTransactionsPage,
  fetchWithdrawalPage,
} from "../../services/auth/api.services.js";
import toast from "react-hot-toast";
 
const initialState = {
  user: {
    username: "Manish",
    tagline: "manish is here",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Astronaut.png",
  },
  socials: [
    { id: "1", name: "Instagram", enabled: true, value: "test user ig" },
    { id: "2", name: "Facebook", enabled: false, value: "test user facebook" },
    { id: "3", name: "Email", enabled: true, value: "test user email" },
    { id: "4", name: "Youtube", enabled: false, value: "test user youtube" },
  ],
  header: [],
  links: [],
};

const transactions =  []
const withdrawals = [];

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateState = useCallback((type, payload) => {
    dispatch({ type, payload });
  }, []);

  const [AllTransaction, setAllTransaction] = useState([...transactions]); // for experimental purpose only remove this line for production
  const [TotalTransactionPages, setTotalTransactionPages] = useState(1);
  const [CurrentTransactionPage, setCurrentTransactionPage] = useState(1);

  const [AllWithdrawals, setAllWithdrawals] = useState([...withdrawals]); // for experimental purpose only remove this line for production
  const [TotalWithdrawalPages, setTotalWithdrawalPages] = useState(1);
  const [CurrentWithdrawalPage, setCurrentWithdrawalPage] = useState(1);

  const getNextTransactionPage = async () => {
    const data = {
      page: CurrentTransactionPage + 1,
    };
    try {
      const response = await fetchTransactionsPage(data);
      console.log(response);
      if (response.status == 200) {
        setAllTransaction(response.data.payload.transactions);
        if (response.data.payload.transactions.length == 0) {
          toast.warning("No more data to show");
          return;
        }
        setCurrentTransactionPage(CurrentTransactionPage + 1);
        setTotalTransactionPages(response.data.payload.totalPages || 1);
      } else {
        console.log("No more data to show");
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getPreviousTransactionPage = async () => {
    const data = {
      page: CurrentTransactionPage - 1,
    };
    try {
      const response = await fetchTransactionsPage(data);
      console.log(response);
      if (response.status == 200) {
        setAllTransaction(response.data.payload.transactions);
        if (response.data.payload.transactions.length == 0) {
          toast.warning("No more data to show");
          return;
        }
        setCurrentTransactionPage(CurrentTransactionPage - 1 || 1);
        setTotalTransactionPages(response.data.payload.totalPages || 1);
      } else {
        console.log("No more data to show");
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNextWithdrawalPage = async () => {
    const data = {
      page: CurrentWithdrawalPage + 1,
    };
    try {
      const response = await fetchWithdrawalPage(data);
      console.log(response);
      if (response.status == 200) {
        setAllWithdrawals(response.data.payload.withdrawals);
        if (response.data.payload.withdrawals.length == 0) {
          toast.warning("No more data to show");
          return;
        }
        setCurrentWithdrawalPage(CurrentWithdrawalPage + 1);
        setTotalWithdrawalPages(response.data.payload.totalPages || 1);
      } else {
        console.log("No more data to show");
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getPreviousWithdrawalPage = async () => {
    const data = {
      page: CurrentWithdrawalPage - 1,
    };
    try {
      const response = await fetchWithdrawalPage(data);
      console.log(response);
      if (response.status == 200) {
        setAllWithdrawals(response.data.payload.withdrawals);
        if (response.data.payload.withdrawals.length == 0) {
          toast.warning("No more data to show");
          return;
        }
        setCurrentWithdrawalPage(CurrentWithdrawalPage - 1 || 1);
        setTotalWithdrawalPages(response.data.payload.totalPages || 1);
      } else {
        console.log("No more data to show");
        toast.warning(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user: state.user,
        socials: state.socials,
        header: state.header,
        links: state.links,
        setUser: (data) => updateState(SET_USER, data),
        setSocials: (data) => updateState(SET_SOCIALS, data),
        setHeader: (data) => updateState(SET_HEADER, data),
        setLinks: (data) => updateState(SET_LINKS, data),
        AllTransaction,
        CurrentTransactionPage,
        TotalTransactionPages,
        getNextTransactionPage,
        getPreviousTransactionPage,
        AllWithdrawals,
        CurrentWithdrawalPage,
        TotalWithdrawalPages,
        getNextWithdrawalPage,
        getPreviousWithdrawalPage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
