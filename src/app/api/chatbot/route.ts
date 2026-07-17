import { sendMessage } from "@/modules/chatbot/dal/chatbot.dal";

export async function POST(request: Request) {
  try {
    const body: ChatbotApiPayload = await request.json();

    const upstream = await sendMessage(body.message, body.user_id, body.config_id)

    if (!upstream.ok || !upstream.body) {
      return Response.json(
        { message: "Streaming failed" },
        { status: upstream.status || 502 }
      );
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Config-ID": upstream.headers.get("X-Config-ID") || ""
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return Response.json({ message }, { status: 502 });
  }
}