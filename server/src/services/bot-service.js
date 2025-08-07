import axios from "axios";
import dotenv from "dotenv"
dotenv.config({})

const BOT_BASE_URL = process.env.BOT_SERVER_URL || 'http://localhost:3000'


export const botAxiosInstance = axios.create({
    baseURL: BOT_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


export const getInviteLink = async (channelId, boughtById) => {
    try {
        const res = await botAxiosInstance.get(`/generate-invite?channelId=${channelId}&boughtById=${boughtById}`)
        return {
            success: true,
            data: res.data
        }
    } catch (error) {
        console.log("Error While Generating Invite Link");

        return {
            success: false
        }
    }
}