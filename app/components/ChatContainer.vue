<script setup lang="ts">
import { useChat } from "~/composables/useChat";
import Message from "./Message.vue";
import ChatInput from "./ChatInput.vue";
import SuggestedActions from "./SuggestedActions.vue";

const { message, messages, hasStartedChat, showInitialContent, sendMessage } =
  useChat();
</script>

<template>
  <div class="flex flex-col min-h-screen max-w-[800px] mx-auto">
    <!-- Initial content -->
    <Transition name="fade">
      <div
        v-if="showInitialContent"
        class="flex-1 flex flex-col items-center justify-center -mt-32"
      >
        <div class="text-center max-w-3xl w-full space-y-1 mb-8 px-4">
          <h1
            class="text-xl leading-tight font-medium text-[#F9F8F6] tracking-[-0.01em] animate-fade-in"
          >
            Good afternoon, murzin.
          </h1>
          <h2
            class="text-xl leading-tight font-medium text-[#8E8E8E] tracking-[-0.01em] animate-fade-in animation-delay-100"
          >
            How can I help you today?
          </h2>
        </div>
        <div class="w-full px-4">
          <div class="mx-auto space-y-6 animate-fade-in animation-delay-200">
            <ChatInput v-model:message="message" @send="sendMessage" />
            <SuggestedActions />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Chat content -->
    <Transition name="fade">
      <div v-if="messages.length > 0" class="flex-1 w-full overflow-auto pb-32">
        <Message
          v-for="(msg, index) in messages"
          :key="index"
          :content="msg.content"
          :is-user="msg.isUser"
        />
      </div>
    </Transition>

    <!-- Fixed chat input at bottom when chat has started -->
    <Transition name="slide-up">
      <div
        v-if="hasStartedChat"
        class="fixed bottom-0 left-0 right-0 bg-[#141414] py-4"
      >
        <div class="max-w-[800px] mx-auto px-4">
          <ChatInput v-model:message="message" @send="sendMessage" />
        </div>
      </div>
    </Transition>
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
