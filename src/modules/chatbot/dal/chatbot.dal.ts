const REQUEST_TIMEOUT = 120000; // 120s for LLM response times

function getBaseUrl(): string {
    const envURL = process.env.LOCAL_ENDPOINT;
    if (!envURL) {
        throw new Error("Endpoint is not defined");
    }
    return envURL;
}

export async function sendMessage(
    message: string,
    user_id: string,
    config_id?: string | null,
): Promise<Response> {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(
            `${getBaseUrl()}/chatbot/message`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    config_id,
                    user_id
                }),
                signal: controller.signal,
            }
        );

        return response;
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Request timed out. The chatbot is taking too long to respond. Please try again.');
        }
        if (error instanceof TypeError && error.message === 'fetch failed') {
            throw new Error('No response from chatbot backend. Please check if the service is running.');
        }
        console.error(error);
        throw new Error('An unexpected error occurred while sending the message.');
    } finally {
        clearTimeout(timeoutId);
    }
}
