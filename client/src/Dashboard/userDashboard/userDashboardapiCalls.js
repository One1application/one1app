import { servicesAxiosInstance } from "../../../client/src/services/config.js";

export const fetchUserDetails = async () => {
  const response = await servicesAxiosInstance.get("/self/customers");
  console.log(response)
};
export const purchasedWebinars = async () => {
  const response = await servicesAxiosInstance.get("/self/purchases/webinars");
  console.log(response)
};
export const purchasedCourses = async () => {
  const response = await servicesAxiosInstance.get("/self/purchases/course");
  console.log(response)
};