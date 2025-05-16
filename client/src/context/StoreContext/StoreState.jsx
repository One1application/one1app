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

const transactions =  [
    { 
        "id": "2a184d90-5c40-4b0b-8aec-32627d3120bd",
        "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
        "amount": 100,
        "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
        "productType": "WEBINAR",
        "buyerId": "26aa0689-21bc-4959-ac3d-747282944184",
        "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "modeOfPayment": "CARD",
        "status": "COMPLETED",
        "createdAt": "2025-05-12T06:29:17.189Z",
        "updatedAt": "2025-05-12T06:29:17.189Z"
    },
    {
        "id": "49f26d7f-15bc-46e3-8b7a-758d42e7fdad",
        "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
        "amount": 100,
        "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
        "productType": "WEBINAR",
        "buyerId": "26aa0689-21bc-4959-ac3d-747282944184",
        "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "modeOfPayment": "upi",
        "status": "success",
        "createdAt": "2025-05-12T04:46:08.705Z",
        "updatedAt": "2025-05-12T04:46:08.705Z"
    },
    {
        "id": "65d645eb-387e-4fe0-925f-8038926cf457",
        "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
        "amount": 100,
        "productId": "9d59ce5a-3b22-40ec-ab79-88fcfb02f027",
        "productType": "PAYING_UP",
        "buyerId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "modeOfPayment": "NET_BANKING",
        "status": "COMPLETED",
        "createdAt": "2025-05-12T17:32:45.224Z",
        "updatedAt": "2025-05-12T17:32:45.224Z"
    },
    {
        "id": "9cc02694-8a92-401d-8892-31c28792a9c9",
        "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
        "amount": 100,
        "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
        "productType": "WEBINAR",
        "buyerId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "modeOfPayment": "CARD",
        "status": "COMPLETED",
        "createdAt": "2025-05-12T15:04:21.366Z",
        "updatedAt": "2025-05-12T15:04:21.366Z"
    },
    {
        "id": "a946fa50-8589-4aaf-a44f-ed7f9c62d701",
        "walletId": "b8e52ce1-d03d-4d5a-b0b8-d2cde31cd58a",
        "amount": 100,
        "productId": "cd65735d-7ba5-49a3-9fef-9c497aada583",
        "productType": "WEBINAR",
        "buyerId": "26aa0689-21bc-4959-ac3d-747282944184",
        "creatorId": "19fa9770-322f-424e-bd53-c0e909e76e0d",
        "modeOfPayment": "upi",
        "status": "success",
        "createdAt": "2025-05-11T16:06:41.954Z",
        "updatedAt": "2025-05-11T16:06:41.954Z"
    }
]
const withdrawals = [
  {
    date: "2022-01-01 10:00 AM",
    amount: "500",
    account: "0000@ylb",
    status: "Success",
  },
  {
    date: "2022-01-02 11:30 AM",
    amount: "1000",
    account: "0000@jkl",
    status: "Pending",
  },
];

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
