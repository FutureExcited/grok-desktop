import OpenAI from "openai";
import { H3Event } from "h3";
import { Readable } from "stream";

export default defineEventHandler(async (event: H3Event) => {
  // Add CORS headers
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  });

  // Handle preflight requests
  if (event.method === "OPTIONS") {
    return sendNoContent(event, 204);
  }

  const config = useRuntimeConfig();
  const body = await readBody(event);

  console.log(
    "[CHAT API] Received request with body:",
    JSON.stringify(body, null, 2)
  );

  if (!body.messages || !Array.isArray(body.messages)) {
    console.error("[CHAT API] Invalid messages format:", body);
    throw createError({
      statusCode: 400,
      message: "Invalid messages format",
    });
  }

  console.log("[CHAT API] Creating OpenAI client with config:", {
    baseURL: config.OPENROUTER_BASE_URL,
    hasApiKey: !!config.OPENROUTER_API_KEY,
  });

  const client = new OpenAI({
    baseURL: config.OPENROUTER_BASE_URL,
    apiKey: config.OPENROUTER_API_KEY,
  });

  try {
    console.log("[CHAT API] Setting SSE headers");
    setResponseHeaders(event, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      // Ensure CORS headers are preserved for SSE
      "Access-Control-Allow-Origin": "*",
    });

    console.log(
      "[CHAT API] Creating completion stream with model:",
      config.OPENROUTER_MODEL
    );
    const stream = await client.chat.completions.create({
      model: config.OPENROUTER_MODEL,
      messages: body.messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    console.log("[CHAT API] Stream created, setting up readable stream");
    const readable = Readable.from(
      (async function* () {
        try {
          let chunkCount = 0;
          let roleEmitted = false;
          let lastChunk: any = null;

          for await (const chunk of stream) {
            lastChunk = chunk;
            chunkCount++;
            console.log(
              `[CHAT API] Processing chunk ${chunkCount}:`,
              JSON.stringify(chunk)
            );

            if (!chunk.choices?.[0]) {
              console.warn(`[CHAT API] No choices in chunk ${chunkCount}`);
              continue;
            }

            const { delta, finish_reason } = chunk.choices[0];

            if (delta?.role && !roleEmitted) {
              console.log(`[CHAT API] Sending initial role`);
              yield `data: ${JSON.stringify({ role: delta.role })}\n\n`;
              roleEmitted = true;
            }

            if (delta?.content) {
              console.log(`[CHAT API] Sending content: ${delta.content}`);
              yield `data: ${JSON.stringify({ content: delta.content })}\n\n`;
            }

            if (finish_reason) {
              console.log(`[CHAT API] Sending finish signal`);
              yield `data: ${JSON.stringify({ finish_reason, done: true })}\n\n`;
            }
          }

          if (!lastChunk?.choices?.[0]?.finish_reason) {
            console.log("[CHAT API] Stream completed, sending done signal");
            yield `data: ${JSON.stringify({ done: true })}\n\n`;
          }
        } catch (error: any) {
          console.error("[CHAT API] Streaming error:", error);
          console.error("[CHAT API] Error stack:", error?.stack);
          yield `data: ${JSON.stringify({
            error: error?.message || "Unknown error occurred",
            stack: error?.stack,
          })}\n\n`;
        }
      })()
    );

    console.log("[CHAT API] Returning stream to client");
    return sendStream(event, readable);
  } catch (error: any) {
    console.error("[CHAT API] OpenRouter API Error:", error);
    console.error("[CHAT API] Error stack:", error?.stack);
    throw createError({
      statusCode: error.status || 500,
      message: error.message || "Failed to get chat completion",
      stack: error?.stack,
    });
  }
});
