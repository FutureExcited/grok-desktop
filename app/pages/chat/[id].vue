<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "~/stores/chat";
import ChatContainer from "~/components/ChatContainer.vue";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const chatId = route.params.id as string;

// Initialize store and check if chat exists
chatStore.init();
if (!chatStore.getChat(chatId)) {
  router.push("/");
}
</script>

<template>
  <ChatContainer :chat-id="chatId" />
</template>
