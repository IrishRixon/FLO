import { sendMessage } from "@/modules/chatbot/dal/chatbot.dal";

export async function POST(request: Request) {
  try {
    const body: ChatbotApiPayload = await request.json();
    
    const response: ChatbotApi = await sendMessage(body.message, body.user_id, body.config_id)
    
    return Response.json({
        message: response.message,
        config_id: response.config_id
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return Response.json({ message }, { status: 502 })
  }
}
