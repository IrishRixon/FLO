interface ChatbotApi {
    message: string;
    config_id: string | null;
    username: string;
} 

interface ChatbotApiPayload extends ChatbotApi {
    user_id: string;
}