import { axiosInstance } from "../utils/AxiosInstance";
 
export const getPurchasedWebibnar = async () => {
  
    try {
        const response = await axiosInstance.get("/self/purchases/webinars");
        console.log(response)
        return response?.data;
    } catch (error) {
        return error?.response;
    }
};

export const getPurchasedPayingUp = async () => {
 
    try {
        const response = await axiosInstance.get("/self/purchases/paying-up");
        console.log(response)
        return response;
    } catch (error) {
        console.log(error || error?.message)
        return error?.response;
    }
};

export const getPuchasedCourses = async () => {
   
    try {
        const response = await axiosInstance.get("/self/purchases/courses");
        console.log(response?.data?.data)
        return response?.data?.data;
    } catch (error) {
        return error?.response;
    }
};

export const getPurchasedPremiumContent = async () => {
    
    try {
        const response = await axiosInstance.get("/self/purchases/premium-content");
        console.log(response)
        return response;
    } catch (error) {
        return error?.response;
    }
};

export const getPurchasedTelegram = async () => {
   
    try {
        const response = await axiosInstance.get("/self/purchases/telegram");
        console.log(response)
        return response;
    } catch (error) {
        return error?.response;
    }
};

export const getAllTransactions = async() =>{
    try {
        const response = await axiosInstance.get("/self/purchases/trasactions");
        console.log(response)
        return response?.data;
    } catch (error) {
        console.log(error || error?.message)
        return error?.response;
    }
}