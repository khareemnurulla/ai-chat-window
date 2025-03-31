import { Message } from "../context/AppContext";

interface OpenRouterResponse {
  choices: {
    delta: {
      content: string;
    };
    finish_reason: string | null;
  }[];
}

const FALLBACK_MODEL = "google/gemini-2.5-pro-exp-03-25:free";

export const callOpenRouterAPI = async (
  prompt: string,
  apiKey: string,
  model: string,
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
) => {
  if (!apiKey) {
    onError("API key is required");
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || FALLBACK_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      onError(`API Error: ${response.status} - ${errorData.message || response.statusText}`)
      return;
    }

    if (!response.body) {
      onError("Response body is empty");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value);

      // Process SSE lines
      let lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Store the incomplete line for the next iteration

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const jsonString = line.substring(5).trim();
          if (jsonString === "[DONE]") {
            onComplete();
            return;
          }

          try {
            const json: OpenRouterResponse = JSON.parse(jsonString);
            const content = json.choices?.[0]?.delta?.content || "";
            onChunk(content);
          } catch (e: any) {
            onError(`SSE JSON Parse Error: ${e.message}`);
            return;
          }
        }
      }
    }
  } catch (error: any) {
    onError(`Request Error: ${error.message}`);
  } finally {
    onComplete();
  }
};
