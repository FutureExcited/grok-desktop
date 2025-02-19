<script setup>
import { computed, ref } from "vue";
import { marked } from "marked";
import {
  Copy,
  Pencil,
  Share,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-vue-next";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  isUser: {
    type: Boolean,
    default: false,
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["edit", "regenerate", "like", "dislike"]);
const contentContainer = ref(null);

const renderedContent = computed(() => {
  if (!props.content && props.isStreaming) {
    return '<p class="animate-pulse">▋</p>';
  }
  return marked(props.content || "", { breaks: true });
});

const copyMessage = () => {
  navigator.clipboard.writeText(props.content);
};

const editMessage = () => {
  emit("edit", props.content);
};

const shareMessage = () => {
  // Implement share functionality
  console.log("Share message:", props.content);
};

const regenerateResponse = () => {
  emit("regenerate");
};

const likeMessage = () => {
  emit("like");
};

const dislikeMessage = () => {
  emit("dislike");
};
</script>

<template>
  <div
    class="message-container px-4 first:pt-0 last:pb-0"
    :class="{ 'user-message': isUser }"
  >
    <div class="max-w-[700px] mx-auto">
      <div class="relative group">
        <div
          ref="contentContainer"
          class="prose prose-invert prose-sm max-w-none transition-all duration-200 will-change-transform"
          :class="[
            isUser
              ? 'text-white bg-[#333537] px-4 py-3 rounded-xl inline-block ml-auto'
              : 'text-[#F9F8F6] assistant-message',
            isStreaming && !isUser ? 'streaming-message' : '',
          ]"
          v-html="renderedContent"
        ></div>

        <!-- Streaming indicator with hardware acceleration -->
        <div
          v-if="isStreaming && !isUser"
          class="absolute -right-6 top-1/2 transform -translate-y-1/2 will-change-transform"
        >
          <div class="typing-indicator">
            <span class="will-change-transform"></span>
            <span class="will-change-transform"></span>
            <span class="will-change-transform"></span>
          </div>
        </div>

        <!-- User message hover actions -->
        <div
          v-if="isUser"
          class="flex justify-end mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1"
        >
          <button
            @click="copyMessage"
            class="p-1.5 rounded-lg text-[#8E8E8E] hover:text-white hover:bg-[#333537] transition-all duration-200"
            title="Copy message"
          >
            <Copy class="w-4 h-4" />
          </button>
          <button
            @click="editMessage"
            class="p-1.5 rounded-lg text-[#8E8E8E] hover:text-white hover:bg-[#333537] transition-all duration-200"
            title="Edit prompt"
          >
            <Pencil class="w-4 h-4" />
          </button>
        </div>

        <!-- AI message actions -->
        <div
          v-if="!isUser && !isStreaming"
          class="flex items-center gap-1 mt-3 text-[#8E8E8E]"
        >
          <button
            @click="regenerateResponse"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-all duration-200"
            title="Regenerate response"
          >
            <RotateCcw class="w-4 h-4" />
          </button>
          <button
            @click="copyMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-all duration-200"
            title="Copy message"
          >
            <Copy class="w-4 h-4" />
          </button>
          <button
            @click="shareMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-all duration-200"
            title="Share message"
          >
            <Share class="w-4 h-4" />
          </button>
          <div class="h-4 w-px bg-[#333537] mx-1"></div>
          <button
            @click="likeMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-all duration-200"
            title="Like"
          >
            <ThumbsUp class="w-4 h-4" />
          </button>
          <button
            @click="dislikeMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-all duration-200"
            title="Dislike"
          >
            <ThumbsDown class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  width: 100%;
  padding: 1rem 1rem;
  contain: content;
}

.message-container.user-message {
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
  text-align: right;
}

.message-container:first-child {
  border-top: none;
}

:deep(h1) {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

:deep(h2) {
  font-size: 1.125rem;
  font-weight: 500;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

:deep(p) {
  margin: 0.75rem 0;
  line-height: 1.6;
  font-size: 0.9375rem;
}

:deep(ul) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

:deep(li) {
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 0.9375rem;
}

:deep(strong) {
  font-weight: 550;
}

.user-message :deep(p) {
  margin: 0;
  text-align: left;
}

.assistant-message {
  position: relative;
  transition: all 0.2s ease-out;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.streaming-message {
  position: relative;
  animation: fadeIn 0.2s ease-out;
  transform: translateZ(0);
}

.streaming-message :deep(p:last-child) {
  position: relative;
}

.streaming-message :deep(p:last-child::after) {
  content: "▋";
  display: inline-block;
  width: 8px;
  margin-left: 2px;
  animation: blink 0.8s ease-in-out infinite;
  vertical-align: baseline;
  will-change: opacity;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
  50% {
    opacity: 0;
    transform: translateZ(0);
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(51, 53, 55, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateX(-4px) translateZ(0);
  will-change: transform;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  background: #8e8e8e;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
  will-change: transform;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

button {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  transform: translateZ(0);
  backface-visibility: hidden;
}

button:hover {
  transform: translateY(-1px) translateZ(0);
  background-color: rgba(51, 53, 55, 0.8) !important;
}

button:active {
  transform: translateY(0) translateZ(0);
}
</style>
