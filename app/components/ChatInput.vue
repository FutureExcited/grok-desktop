<script setup>
import { ref, onMounted } from "vue";
import { Send, ChevronDown, Paperclip, Search, Brain } from "lucide-vue-next";

const props = defineProps({
  message: String,
});
const emit = defineEmits(["send", "update:message"]);
const selectedModel = ref("Grok 3");
const showModelSelector = ref(false);
const fileInputRef = ref(null);

const placeholders = [
  "Generate an image for me",
  "Understand the universe",
  "Show me top trends",
  "Help me with coding",
];
const currentPlaceholder = ref("");
let currentPlaceholderIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

const typeText = () => {
  const placeholder = placeholders[currentPlaceholderIndex];

  if (!isDeleting && currentCharIndex <= placeholder.length) {
    currentPlaceholder.value = placeholder.substring(0, currentCharIndex);
    currentCharIndex++;
    setTimeout(typeText, 100);
  } else if (isDeleting && currentCharIndex >= 0) {
    currentPlaceholder.value = placeholder.substring(0, currentCharIndex);
    currentCharIndex--;
    setTimeout(typeText, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      currentPlaceholderIndex =
        (currentPlaceholderIndex + 1) % placeholders.length;
      setTimeout(typeText, 1000);
    } else {
      setTimeout(typeText, 2000);
    }
  }
};

onMounted(() => {
  typeText();
});

const toggleFeature = (feature) => {
  if (feature === "attachment") {
    fileInputRef.value?.click();
  }
  console.log(`Toggled ${feature}`);
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    console.log("Files selected:", files);
    // Handle file upload logic here
  }
};
</script>

<template>
  <div class="w-full space-y-3">
    <div
      class="bg-[#333537] rounded-[12px] flex flex-col gap-2 px-3.5 py-3 relative transition-colors duration-200"
    >
      <div class="flex items-center gap-2">
        <button
          @click="toggleFeature('attachment')"
          class="text-[#8E8E8E] hover:text-white p-1 rounded-lg transition-all duration-200 hover:bg-[#404040]"
        >
          <Paperclip class="w-4 h-4" />
        </button>
        <input
          type="file"
          ref="fileInputRef"
          @change="handleFileChange"
          class="hidden"
          multiple
        />
        <input
          :value="message"
          @input="emit('update:message', $event.target.value)"
          type="text"
          :placeholder="currentPlaceholder"
          class="bg-transparent text-[14px] text-gray-200 w-full focus:outline-none placeholder:text-[#6B7280] leading-normal"
          @keyup.enter="emit('send')"
        />
      </div>

      <div class="flex items-center justify-between pt-0.5">
        <div class="flex items-center gap-2">
          <button
            @click="toggleFeature('deepSearch')"
            class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[#8E8E8E] hover:text-white hover:bg-[#404040] transition-all duration-200"
          >
            <Search class="w-4 h-4" />
            <span class="text-xs">DeepSearch</span>
          </button>
          <button
            @click="toggleFeature('think')"
            class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[#8E8E8E] hover:text-white hover:bg-[#404040] transition-all duration-200"
          >
            <Brain class="w-4 h-4" />
            <span class="text-xs">Think</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <button
              @click="showModelSelector = !showModelSelector"
              class="flex items-center gap-1.5 text-[#8E8E8E] hover:text-white transition-all duration-200 text-xs px-2 py-1 rounded-lg hover:bg-[#404040]"
            >
              <span>{{ selectedModel }}</span>
              <ChevronDown
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="{ 'rotate-180': showModelSelector }"
              />
            </button>
            <div
              v-if="showModelSelector"
              class="absolute bottom-full mb-2 right-0 bg-[#2A2A2A] rounded-lg py-1 min-w-[120px] shadow-lg transform origin-bottom-right transition-all duration-200 scale-100 opacity-100"
              v-cloak
            >
              <button
                v-for="model in ['Grok 3', 'Grok 2']"
                :key="model"
                @click="
                  selectedModel = model;
                  showModelSelector = false;
                "
                class="w-full px-3 py-1.5 text-left text-xs text-[#E5E5E5] hover:bg-[#404040] transition-colors duration-200"
              >
                {{ model }}
              </button>
            </div>
          </div>
          <button
            @click="emit('send')"
            class="hover:bg-[#404040] p-1 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Send class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease-in-out;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
