import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useFeaturesStore } from "./features";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export interface Message {
  content: string;
  isUser: boolean;
  timestamp: number;
  isStreaming?: boolean;
  attachedFiles?: FileInfo[];
}

export interface ChatState {
  messages: Message[];
  message: string;
}

export interface ChatsState {
  [key: string]: ChatState;
}

export interface StreamChunk {
  role?: string;
  content?: string;
  finish_reason?: string;
  done?: boolean;
  error?: string;
  stack?: string;
}

export interface StreamResponse {
  content?: string;
  error?: string;
  done: boolean;
}

export const useChatStore = defineStore(
  "chat",
  () => {
    const chats = ref<ChatsState>({});
    const featuresStore = useFeaturesStore();
    let updateTimeout: NodeJS.Timeout | null = null;
    const DEBOUNCE_TIME = 50; // 50ms debounce for smooth updates

    const init = () => {
      if (typeof chats.value !== "object" || Array.isArray(chats.value)) {
        chats.value = {};
      }
    };

    init();

    const initChat = (chatId: string, initialMessage?: string) => {
      if (!chats.value[chatId]) {
        chats.value[chatId] = reactive({
          messages: [],
          message: "",
        });

        if (initialMessage) {
          sendMessage(chatId, initialMessage);
        }
      }
      return chats.value[chatId];
    };

    const getChat = (chatId: string) => {
      return chats.value[chatId];
    };

    const updateMessageContent = (message: Message, content: string) => {
      if (message.isStreaming) {
        // Remove debouncing to ensure immediate updates
        message.content = content;
      }
    };

    const setMessageStreaming = (message: Message, isStreaming: boolean) => {
      message.isStreaming = isStreaming;
      // Force a UI update when streaming ends
      if (!isStreaming) {
        message.timestamp = Date.now();
      }
    };

    const sendMessage = async (chatId: string, content?: string) => {
      const chat = chats.value[chatId];
      if (!chat) {
        console.error("[CHAT] Chat not found:", chatId);
        return;
      }

      const messageContent = content || chat.message;
      if (!messageContent?.trim()) {
        console.error("[CHAT] No message content to send");
        return;
      }

      try {
        console.log("[CHAT] Sending message:", messageContent);
        console.log("[CHAT] Attached files:", featuresStore.attachedFiles);

        // Add user message with attached files
        const userMessage = reactive<Message>({
          content: messageContent,
          isUser: true,
          timestamp: Date.now(),
          attachedFiles:
            featuresStore.attachedFiles.length > 0
              ? [...featuresStore.attachedFiles]
              : undefined,
        });

        console.log("[CHAT] Created message with files:", userMessage);
        chat.messages.push(userMessage);

        // Clear the input immediately after sending
        chat.message = "";

        // Prepare context information and files
        const textFiles = featuresStore.attachedFiles
          .filter((file) => !file.isImage)
          .map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            content: file.content,
          }));

        const imageFiles = featuresStore.attachedFiles
          .filter((file) => file.isImage)
          .map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            base64Content: file.base64Content,
          }));

        const contextInfo = {
          webSearch: featuresStore.searchEnabled,
          deepSearch: featuresStore.deepSearchEnabled,
          think: featuresStore.thinkEnabled,
          textFiles,
          imageFiles,
        };

        console.log("[CHAT] Prepared context info:", contextInfo);

        // Add assistant message that will be streamed
        const assistantMessage = reactive<Message>({
          content: "",
          isUser: false,
          timestamp: Date.now(),
          isStreaming: true,
        });
        chat.messages.push(assistantMessage);

        console.log("[CHAT] Making API request");

        // Call the Rust command
        await invoke("chat", {
          messages: chat.messages
            .filter((msg) => !msg.isStreaming)
            .map((msg) => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content,
            })),
          contextInfo,
        });

        // Listen for stream events
        const unlisten = await listen<StreamResponse>(
          "chat_stream",
          (event) => {
            if (event.payload.error) {
              throw new Error(event.payload.error);
            }

            if (event.payload.content) {
              updateMessageContent(
                assistantMessage,
                assistantMessage.content + event.payload.content
              );
            }

            if (event.payload.done) {
              setMessageStreaming(assistantMessage, false);
              unlisten();
            }
          }
        );
      } catch (error) {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
          updateTimeout = null;
        }
        console.error("[CHAT] Error in chat completion:", error);
        const lastMessage = chat.messages[chat.messages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          updateMessageContent(
            lastMessage,
            "I apologize, but I encountered an error while processing your request. Please try again."
          );
          setMessageStreaming(lastMessage, false);
        }
      }
    };

    const editMessage = (chatId: string, content: string) => {
      const chat = chats.value[chatId];
      if (!chat) return;
      chat.message = content;
    };

    const regenerateMessage = async (chatId: string) => {
      const chat = chats.value[chatId];
      if (!chat) return;

      const lastUserMessageIndex = [...chat.messages]
        .reverse()
        .findIndex((msg) => msg.isUser);
      if (lastUserMessageIndex === -1) return;

      const lastUserMessage =
        chat.messages[chat.messages.length - 1 - lastUserMessageIndex];
      if (lastUserMessage) {
        await sendMessage(chatId, lastUserMessage.content);
      }
    };

    const likeMessage = (chatId: string) => {
      console.log("Message liked in chat:", chatId);
    };

    const dislikeMessage = (chatId: string) => {
      console.log("Message disliked in chat:", chatId);
    };

    return {
      chats,
      init,
      initChat,
      getChat,
      sendMessage,
      editMessage,
      regenerateMessage,
      likeMessage,
      dislikeMessage,
    };
  },
  {
    persist: {
      storage: import.meta.client ? localStorage : undefined,
    },
  }
);
