<script setup lang="ts">
import { computed, ref } from "vue";
import { marked } from "marked";
import {
  Copy,
  Pencil,
  Share,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  FileText,
} from "lucide-vue-next";
import type { FileInfo } from "~~/app/stores/features";

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
  attachedFiles: {
    type: Array as () => FileInfo[],
    default: () => [],
  },
});

// Add logging to verify props
console.log("[MESSAGE] Rendering message with files:", props.attachedFiles);

const emit = defineEmits(["edit", "regenerate", "like", "dislike"]);
const contentContainer = ref(null);

const renderedContent = computed(() => {
  if (!props.content && props.isStreaming) {
    return "";
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

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};
</script>

<template>
  <div
    class="message-container px-4 first:pt-0 last:pb-0"
    :class="{ 'user-message': isUser }"
  >
    <div class="max-w-[700px] mx-auto">
      <div class="relative group">
        <!-- Message Content -->
        <div
          ref="contentContainer"
          class="prose prose-invert prose-sm max-w-none transition-all duration-300 ease-out"
          :class="[
            isUser
              ? 'text-white bg-gradient-to-br from-[#3a3b3d] to-[#2d2e30] px-5 py-4 rounded-[20px] inline-block ml-auto shadow-lg shadow-black/10'
              : 'text-[#F9F8F6] assistant-message',
          ]"
        >
          <Transition
            enter-active-class="transition-opacity duration-300 ease-out"
            leave-active-class="transition-opacity duration-300 ease-out"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div v-if="!isStreaming || content" v-html="renderedContent"></div>
            <div v-else class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Transition>

          <!-- Attached Files -->
          <div
            v-if="attachedFiles && attachedFiles.length > 0"
            class="mt-2 border border-white/10 rounded-2xl"
          >
            <div class="flex flex-wrap gap-3">
              <!-- Image Files -->
              <div
                v-for="file in attachedFiles.filter((f) => f.isImage)"
                :key="file.name"
                class="group/file relative transition-all duration-300 ease-out transform hover:-translate-y-1 rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.07] to-transparent hover:from-white/[0.1] shadow-xl shadow-black/20 aspect-square w-[160px]"
              >
                <img
                  :src="file.base64Content"
                  :alt="file.name"
                  class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/file:scale-[1.15]"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 opacity-0 group-hover/file:opacity-100 transition-all duration-300"
                >
                  <div class="absolute bottom-3.5 left-4 right-4">
                    <div
                      class="text-sm text-white font-medium leading-none truncate drop-shadow-lg"
                    >
                      {{ file.name }}
                    </div>
                    <div
                      class="text-xs text-white/90 mt-1.5 font-medium drop-shadow-lg"
                    >
                      {{ formatFileSize(file.size) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Text Files -->
              <div
                v-for="file in attachedFiles.filter((f) => !f.isImage)"
                :key="file.name"
                class="group/file flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-white/[0.07] to-transparent hover:from-white/[0.1] rounded-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 shadow-lg shadow-black/10"
              >
                <div
                  class="p-2 bg-white/[0.07] rounded-xl group-hover/file:bg-white/[0.1] transition-colors duration-300"
                >
                  <FileText class="w-5 h-5 text-white/90" />
                </div>
                <div class="flex flex-col min-w-0 py-0.5">
                  <span
                    class="text-[13px] text-white font-medium leading-none truncate"
                  >
                    {{ file.name }}
                  </span>
                  <span class="text-xs text-white/70 mt-1 font-medium">
                    {{ formatFileSize(file.size) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User message hover actions -->
        <div
          v-if="isUser"
          class="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 gap-1.5"
        >
          <button
            v-for="(action, i) in [
              { icon: Copy, title: 'Copy message', onClick: copyMessage },
              { icon: Pencil, title: 'Edit prompt', onClick: editMessage },
            ]"
            :key="i"
            @click="action.onClick"
            class="p-1.5 rounded-xl text-[#8E8E8E] hover:text-white hover:bg-[#333537] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0"
            :title="action.title"
          >
            <component :is="action.icon" class="w-4 h-4" />
          </button>
        </div>

        <!-- AI message actions -->
        <div
          v-if="!isUser && !isStreaming"
          class="flex items-center gap-1.5 mt-3 text-[#8E8E8E]"
        >
          <button
            v-for="(action, i) in [
              {
                icon: RotateCcw,
                title: 'Regenerate response',
                onClick: regenerateResponse,
              },
              { icon: Copy, title: 'Copy message', onClick: copyMessage },
              { icon: Share, title: 'Share message', onClick: shareMessage },
            ]"
            :key="i"
            @click="action.onClick"
            class="p-1.5 rounded-xl hover:text-white hover:bg-[#333537] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0"
            :title="action.title"
          >
            <component :is="action.icon" class="w-4 h-4" />
          </button>
          <div class="h-4 w-px bg-[#333537] mx-1"></div>
          <button
            v-for="(action, i) in [
              { icon: ThumbsUp, title: 'Like', onClick: likeMessage },
              { icon: ThumbsDown, title: 'Dislike', onClick: dislikeMessage },
            ]"
            :key="i"
            @click="action.onClick"
            class="p-1.5 rounded-xl hover:text-white hover:bg-[#333537] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0"
            :title="action.title"
          >
            <component :is="action.icon" class="w-4 h-4" />
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
  transform: translateZ(0);
  backface-visibility: hidden;
}

.typing-indicator {
  display: inline-flex;
  gap: 3px;
  padding: 10px 14px;
  background: rgba(51, 53, 55, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  will-change: transform;
  margin: 4px 0;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  background: #a8a8a8;
  border-radius: 50%;
  opacity: 0.9;
  will-change: transform;
  animation: typingBounce 1.2s infinite;
  transform: translateZ(0);
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%,
  60%,
  100% {
    transform: translateY(0) scale(0.8) translateZ(0);
    background: #a8a8a8;
  }
  30% {
    transform: translateY(-4px) scale(1.1) translateZ(0);
    background: #d4d4d4;
  }
}

button {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

.group\/file {
  backface-visibility: hidden;
  will-change: transform;
  transform: translateZ(0);
}

.group\/file img {
  backface-visibility: hidden;
  will-change: transform;
  transform: translateZ(0);
}
</style>
