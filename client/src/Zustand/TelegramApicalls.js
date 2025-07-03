import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { servicesAxiosInstance } from '../services/config.js';

export const useTelegramAuthStore = create((set) => ({
  loading: false,
  error: null,
  success: false,
  result: null,
  isAuthenticated: localStorage.getItem("sessionString") || false,

  sendLoginCode: async (phoneNumber) => {
    try {
      set({ loading: true, error: null, success: false });
      const response = await servicesAxiosInstance.post(
        "/telegram/send-login-code",
        { phoneNumber }
      );
      set({ loading: false, success: true, result: response.data });
      toast.success("Login code sent!");
      return {
        success: true,
        data: response.data?.payload,
      };
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to send login code";
      set({ loading: false, error: message });
      return {
        success: false,
        error: message,
      };
    }
  },

  signInClient: async (data) => {
    console.log(data);
    try {
      set({ loading: true, error: null, success: false });
      const response = await servicesAxiosInstance.post(
        "/telegram/sign-in",
        data
      );
      set({ loading: false, success: true, result: response.data });
      toast.success("Signed in successfully!");
      return {
        success: true,
        data: response.data?.payload,
      };
    } catch (error) {
      const message = error?.response?.data?.message || "Sign-in failed";
      set({ loading: false, error: message });
      toast.error(message);
      return {
        success: false,
        error: message,
      };
    }
  },

  createTelegram: async (body) => {
    try {
      const response = await servicesAxiosInstance.post("/telegram/create-telegrams", body)
      console.log(response);

      return response;
    } catch (error) {
      console.log(error);
    }
  },

  getCreatorsTelegram: async () => {
    try {
      let res = await servicesAxiosInstance.get("/telegram/get-creators-telegram");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  },

  getTelegram: async (telegramId) => {
    try {
      let res = await servicesAxiosInstance.get(`/telegram/get-telegram-by-id/${telegramId}`);
      console.log(res);

      return {
        success : true,
        data : res?.data?.payload?.telegram
      }
    } catch (error) {
      console.log(error);
    }
  },

  editTelegram: async (telegramId) => {
    try {
      let res = await servicesAxiosInstance.patch(`telegram/${telegramId}`);
      console.log(res);

      return {
        success: true,
        data: res?.data,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        data: error?.response?.data,
      };
    }
  },

  editTelegramSubscription: async (telegramId, subscriptionId) => {
    try {
      let response = await servicesAxiosInstance.patch(
        `/telegram/${telegramId}/subscriptions/${subscriptionId}`
      );

      console.log(response);

      return {
        success: true,
        data: response?.data,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: error?.response?.data,
      };
    }
  },

  delTelegramSubscription: async (telegramId, subscriptionId) => {
    try {
      let response = await servicesAxiosInstance.delete(
        `/telegram/${telegramId}/subscriptions/${subscriptionId}`
      );

      console.log(response);

      return {
        success: true,
        data: response?.data,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        data: error?.response?.data,
      };
    }
  },

  editTelegramDiscounts: async (telegramId, discountId) => {
    try {
      let res = await servicesAxiosInstance.patch(
        `telegram/${telegramId}/discounts/${discountId}`
      );

      console.log(res);

      return {
        success: true,
        data: res?.data,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        data: error?.response?.data,
      };
    }
  },

  delTelegramDiscounts: async (telegramId, discountId) => {
    try {
      const response = await servicesAxiosInstance.delete(
        `/telegram/${telegramId}/discounts/${discountId}`
      );

      console.log(response);

      return {
        success: true,
        data: response?.data,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: error?.response?.data,
      };
    }
  },
}));
