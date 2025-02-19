<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "~/stores/chat";
import ChatInput from "~/components/ChatInput.vue";
import SuggestedActions from "~/components/SuggestedActions.vue";

const router = useRouter();
const chatStore = useChatStore();
const message = ref("");

const handleSend = () => {
  if (!message.value.trim()) return;

  // Generate UUID v4
  const uuid = crypto.randomUUID();

  // Initialize chat with the first message
  chatStore.initChat(uuid, message.value);

  // Navigate to chat
  router.push(`/chat/${uuid}`);
};
</script>

<template>
  <div class="mt-[30vh] flex flex-col items-center">
    <div class="text-center space-y-0 mb-8">
      <h1
        class="text-3xl leading-tight font-medium text-[#F9F8F6] tracking-[-0.01em] animate-fade-in"
      >
        Good afternoon, murzin.
      </h1>
      <h2
        class="text-3xl leading-tight font-medium text-[#B9BCC1] tracking-[-0.01em] animate-fade-in animation-delay-100"
      >
        How can I help you today?
      </h2>
    </div>
    <div class="space-y-6 w-[50rem] animate-fade-in animation-delay-200">
      <ChatInput
        v-model:message="message"
        @send="handleSend"
        :chatMode="false"
      />
      <SuggestedActions />
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
