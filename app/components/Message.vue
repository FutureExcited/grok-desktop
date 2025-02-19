<script setup>
import { computed } from "vue";
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
});

const emit = defineEmits(["edit", "regenerate", "like", "dislike"]);

const renderedContent = computed(() => {
  return marked(props.content, { breaks: true });
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
          class="prose prose-invert prose-sm max-w-none"
          :class="[
            isUser
              ? 'text-white bg-[#333537] px-4 py-3 rounded-xl inline-block ml-auto'
              : 'text-[#F9F8F6]',
          ]"
          v-html="renderedContent"
        ></div>

        <!-- User message hover actions -->
        <div
          v-if="isUser"
          class="flex justify-end mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1"
        >
          <button
            @click="copyMessage"
            class="p-1.5 rounded-lg text-[#8E8E8E] hover:text-white hover:bg-[#333537] transition-colors"
            title="Copy message"
          >
            <Copy class="w-4 h-4" />
          </button>
          <button
            @click="editMessage"
            class="p-1.5 rounded-lg text-[#8E8E8E] hover:text-white hover:bg-[#333537] transition-colors"
            title="Edit prompt"
          >
            <Pencil class="w-4 h-4" />
          </button>
        </div>

        <!-- AI message actions -->
        <div v-if="!isUser" class="flex items-center gap-1 mt-3 text-[#8E8E8E]">
          <button
            @click="regenerateResponse"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-colors"
            title="Regenerate response"
          >
            <RotateCcw class="w-4 h-4" />
          </button>
          <button
            @click="copyMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-colors"
            title="Copy message"
          >
            <Copy class="w-4 h-4" />
          </button>
          <button
            @click="shareMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-colors"
            title="Share message"
          >
            <Share class="w-4 h-4" />
          </button>
          <div class="h-4 w-px bg-[#333537] mx-1"></div>
          <button
            @click="likeMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-colors"
            title="Like"
          >
            <ThumbsUp class="w-4 h-4" />
          </button>
          <button
            @click="dislikeMessage"
            class="p-1.5 rounded-lg hover:bg-[#333537] hover:text-white transition-colors"
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.message-container.user-message {
  border-bottom: none;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  text-align: right;
}

.message-container:last-child {
  border-bottom: none;
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
</style>
