<script setup>
import { computed } from "vue";
import { marked } from "marked";

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

const renderedContent = computed(() => {
  return marked(props.content, { breaks: true });
});
</script>

<template>
  <div class="message-container py-6 px-4 first:pt-0 last:pb-0">
    <div class="max-w-[800px] mx-auto">
      <div
        class="prose prose-invert prose-sm max-w-none text-[#F9F8F6]"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.message-container:last-child {
  border-bottom: none;
}

:deep(h1) {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #f9f8f6;
}

:deep(h2) {
  font-size: 1.125rem;
  font-weight: 500;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  color: #f9f8f6;
}

:deep(p) {
  margin: 0.75rem 0;
  line-height: 1.6;
  font-size: 0.9375rem;
  color: #f9f8f6;
}

:deep(ul) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

:deep(li) {
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 0.9375rem;
  color: #f9f8f6;
}

:deep(strong) {
  color: #f9f8f6;
  font-weight: 500;
}
</style>
