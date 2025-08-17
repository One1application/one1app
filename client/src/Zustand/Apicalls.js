import { create } from 'zustand';
import { servicesAxiosInstance } from '../services/config.js';
import toast from 'react-hot-toast';

const useTelegramStore = create((set, get) => ({
  channelData: null,
  loading: false,

  // Fetch Telegram channel
  fetchTelegramChannel: async () => {
    set({ loading: true });
    try {
      const response = await servicesAxiosInstance.get("telegram/creator-telegram-promotional");
      set({ channelData: response?.data?.found });
    } catch (error) {
     
      console.error("Fetch error:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Create new channel
  createChannel: async (formData) => {
    set({ loading: true });
    try {
      const response = await servicesAxiosInstance.post(
        "/telegram/create-telegram-promotional",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(response?.data?.message || "Channel created successfully");
      await get().fetchTelegramChannel(); // Refresh data after creation
      return { success: true };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Create failed");
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  // Delete channel
  deleteChannel: async (id) => {
    set({ loading: true });
    try {
      const response = await servicesAxiosInstance.delete(
        `/telegram/delete-telegram-promotional/${id}`
      );
      toast.success(response?.data?.message || "Channel deleted");
      set({ channelData: null });
      await get().fetchTelegramChannel();  
      return { success: true };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  // Update channel
  updateChannel: async (id, updateData) => {
    set({ loading: true });
    try {
      const response = await servicesAxiosInstance.put(
        `/telegram/edit-telegram-promotional/${id}`,
        updateData
      );
      toast.success(response?.data?.message || "Channel updated");
      await get().fetchTelegramChannel();
      return { success: true };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
 
 
}));

 

export default useTelegramStore;
