<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useChatStore } from "~/stores/chat";
import { ArrowDown } from "lucide-vue-next";
import Message from "./Message.vue";
import ChatInput from "./ChatInput.vue";
import { useFeaturesStore } from "~~/app/stores/features";

const props = defineProps<{
  chatId: string;
}>();

const chatStore = useChatStore();
const showScrollButton = ref(false);
let scrollTimeout: NodeJS.Timeout | null = null;
const featuresStore = useFeaturesStore();

const chat = computed(() => {
  const currentChat = chatStore.getChat(props.chatId);
  if (!currentChat) {
    chatStore.initChat(props.chatId);
    return chatStore.getChat(props.chatId);
  }
  console.log("[CHAT_CONTAINER] Current chat messages:", currentChat.messages);
  return currentChat;
});

const handleSend = () => {
  if (!chat.value?.message?.trim()) return;
  chatStore.sendMessage(props.chatId);
  // Clear attached files after sending the message
  featuresStore.clearFiles();
};

const handleEdit = (content: string) => {
  if (!chat.value) return;
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

// Optimized scroll handling with debounce
const scrollToBottom = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(async () => {
    await nextTick();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
    scrollTimeout = null;
  }, 32); // ~2 frames at 60fps
};

// Check if we're near bottom
const isNearBottom = () => {
  const threshold = 100; // pixels from bottom
  return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - threshold
  );
};

// Scroll position handler
const handleScroll = () => {
  showScrollButton.value = !isNearBottom();
};

// Watch for changes and scroll
watch(
  () => chat.value?.messages,
  () => {
    if (isNearBottom()) {
      scrollToBottom();
    }
  },
  { deep: true }
);

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  scrollToBottom();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen pb-32">
    <!-- Chat content -->
    <div class="flex-1 w-full" style="contain: content">
      <Message
        v-for="msg in chat?.messages || []"
        :key="msg.timestamp"
        :content="msg.content"
        :is-user="msg.isUser"
        :is-streaming="msg.isStreaming"
        :attached-files="msg.attachedFiles || []"
        @edit="handleEdit"
        @regenerate="handleRegenerate"
        @like="handleLike"
        @dislike="handleDislike"
      />
    </div>

    <!-- Go down button -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <button
        v-show="showScrollButton"
        @click="scrollToBottom"
        class="fixed bottom-32 p-2.5 bg-[#333537]/90 hover:bg-[#3A3C3E] text-[#8E8E8E] hover:text-white rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 will-change-transform group"
        style="
          backface-visibility: hidden;
          right: calc((100vw - 50rem) / 2 + 2rem);
        "
      >
        <ArrowDown class="w-4 h-4 transition-colors duration-200" />
      </button>
    </Transition>

    <!-- Fixed chat input at bottom -->
    <div
      class="fixed bottom-4 left-0 right-0 py-2 bg-transparent will-change-transform"
      style="transform: translateZ(0); backface-visibility: hidden"
    >
      <div class="w-[50rem] mx-auto px-4">
        <ChatInput
          v-if="chat"
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
  transition: opacity 0.2s ease-out;
  will-change: opacity;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.2s ease-out,
    opacity 0.2s ease-out;
  will-change: transform, opacity;
}

.slide-up-enter-from {
  transform: translateY(100%) translateZ(0);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%) translateZ(0);
  opacity: 0;
}
</style>
