import { axiosInstance } from "../utils/AxiosInstance.js";

export const Register = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return { success: true, data: response.data }; 
  } catch (error) {
    return {
      success: false,
      data: error?.response?.data || { message: "Something went wrong" },
    };
  }
};


export const userRegistration = async(data) =>{
  try {
   
    const response = await axiosInstance.post("/auth/register/verify-otp", data)
    return response
  } catch (error) {
    return error?.response;
  }
}

export const userLogin = async(data) =>{
  try {
 
    const response = await axiosInstance.post("/auth/user/login", data)
    console.log(response)
   return {

     success : true,
     data : response?.data
   }

   
  } catch (error) {
    console.log(error?.response)
    return{
      success : false,
        data: error?.response?.data || { message: "Something went wrong" },
    }
  }
}


export const verifyLogin = async(data) =>{
  try {
    const response = await axiosInstance.post("/auth/login/verify-otp", data)
    return {
      success : true,
      data : response?.data
    }
  } catch (error) {
    return{
      success : false,
        data: error?.response?.data || { message: "Something went wrong" },
    }
  }
}

export const getUserDetails = async() =>{
  
      const response = await axiosInstance.get("/self/details")
     
      return response;
  }
    
  

