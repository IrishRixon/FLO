import { sendMessage } from "@/modules/chatbot/dal/chatbot.dal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response: {message: string, config_id?: string | undefined} = await sendMessage(body.message, body.config_id)
    
    return Response.json({
        message: response.message,
        config_id: response.config_id
    })
  } catch (error) {
    return Response.json({
        message: "Something went wrong"
    })
  }
}