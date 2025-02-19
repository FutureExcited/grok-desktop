import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Message {
  content: string;
  isUser: boolean;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  message: string;
}

export const useChatStore = defineStore(
  "chat",
  () => {
    const chats = ref<Map<string, ChatState>>(new Map());

    const initChat = (chatId: string, initialMessage?: string) => {
      if (!chats.value.has(chatId)) {
        chats.value.set(chatId, {
          messages: initialMessage
            ? [
                {
                  content: initialMessage,
                  isUser: true,
                  timestamp: Date.now(),
                },
                {
                  content: placeholder,
                  isUser: false,
                  timestamp: Date.now() + 1,
                },
              ]
            : [],
          message: "",
        });
      }
      return chats.value.get(chatId)!;
    };

    const getChat = (chatId: string) => {
      return chats.value.get(chatId);
    };

    const sendMessage = (chatId: string, content: string) => {
      const chat = chats.value.get(chatId);
      if (!chat || !content.trim()) return;

      chat.messages.push({
        content,
        isUser: true,
        timestamp: Date.now(),
      });

      // Add bot response
      chat.messages.push({
        content: placeholder,
        isUser: false,
        timestamp: Date.now() + 1,
      });

      chat.message = "";
    };

    const editMessage = (chatId: string, content: string) => {
      const chat = chats.value.get(chatId);
      if (!chat) return;
      chat.message = content;
    };

    const regenerateMessage = (chatId: string) => {
      const chat = chats.value.get(chatId);
      if (!chat) return;

      chat.messages.push({
        content: placeholder,
        isUser: false,
        timestamp: Date.now(),
      });
    };

    const likeMessage = (chatId: string) => {
      console.log("Message liked in chat:", chatId);
    };

    const dislikeMessage = (chatId: string) => {
      console.log("Message disliked in chat:", chatId);
    };

    return {
      chats,
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
    persist: true,
  }
);

const placeholder = `I'd love to help you brainstorm ideas! What specific topic or challenge would you like to explore together? I can help with coding, writing, analysis, or any other creative endeavor you have in mind.

I'm equipped with extensive knowledge across many fields and can approach problems from multiple angles. Let's dive in and find the best solution for your needs!`;
