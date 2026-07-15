import { apiClient } from "@/lib/axios-instance";

export async function sendMessage(message: string, config_id?: string | null) {
    console.log(config_id, "config id");
    
    try {
        const res = await apiClient.post(
            '/chatbot/message',
            {
                message,
                config_id
            }
        );

        return res.data
    } catch (error) {
        console.error(error);
        throw new Error(error as string)
    }
}