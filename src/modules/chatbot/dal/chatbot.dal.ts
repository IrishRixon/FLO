import { apiClient } from "@/lib/axios-instance";
import { AxiosError } from "axios";

export async function sendMessage 
(
    message: string, 
    user_id: string,
    config_id?: string | null, 
) {
    console.log(config_id, "config id");
    
    try {
        const res = await apiClient.post(
            '/chatbot/message',
            {
                message,
                config_id,
                user_id
            }
        );

        return res.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. The chatbot is taking too long to respond. Please try again.');
            }
            if (error.response) {
                throw new Error(`Backend error: ${error.response.status} - ${error.response.data?.message || error.message}`);
            }
            if (error.request) {
                throw new Error('No response from chatbot backend. Please check if the service is running.');
            }
        }
        console.error(error);
        throw new Error('An unexpected error occurred while sending the message.');
    }
}
