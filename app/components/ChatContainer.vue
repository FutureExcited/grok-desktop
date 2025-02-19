<script setup lang="ts">
import { computed } from "vue";
import { useChatStore } from "~/stores/chat";
import Message from "./Message.vue";
import ChatInput from "./ChatInput.vue";

const props = defineProps<{
  chatId: string;
}>();

const chatStore = useChatStore();
const chat = computed(() => chatStore.getChat(props.chatId)!);

const handleSend = (content: string) => {
  chatStore.sendMessage(props.chatId, content);
};

const handleEdit = (content: string) => {
  chatStore.editMessage(props.chatId, content);
};

const handleRegenerate = () => {
  chatStore.regenerateMessage(props.chatId);
};

const handleLike = () => {
  chatStore.likeMessage(props.chatId);
};

const handleDislike = () => {
  chatStore.dislikeMessage(props.chatId);
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Chat content -->
    <div class="flex-1 w-full overflow-auto pb-32">
      <Message
        v-for="msg in chat.messages"
        :key="msg.timestamp"
        :content="msg.content"
        :is-user="msg.isUser"
        @edit="handleEdit"
        @regenerate="handleRegenerate"
        @like="handleLike"
        @dislike="handleDislike"
      />
    </div>

    <!-- Fixed chat input at bottom -->
    <div class="fixed bottom-4 left-0 right-0 py-2">
      <div class="w-[50rem] mx-auto px-4">
        <ChatInput
          v-model:message="chat.message"
          @send="handleSend"
          :chatMode="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
