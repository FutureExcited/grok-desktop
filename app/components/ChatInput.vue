<script setup>
import { ref, onMounted, computed } from "vue";
import { Send, ChevronDown, Paperclip, Search, Brain } from "lucide-vue-next";
import { useFeaturesStore } from "~/stores/features";
import FilePreview from "~/components/FilePreview.vue";

const props = defineProps({
  message: String,
  chatMode: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["send", "update:message"]);
const selectedModel = ref("Grok 3");
const showModelSelector = ref(false);
const fileInputRef = ref(null);
const enableSearch = ref(true);
const inputRef = ref(null);
const featuresStore = useFeaturesStore();

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
    setTimeout(typeText, 50);
  } else if (isDeleting && currentCharIndex >= 0) {
    currentPlaceholder.value = placeholder.substring(0, currentCharIndex);
    currentCharIndex--;
    setTimeout(typeText, 25);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      currentPlaceholderIndex =
        (currentPlaceholderIndex + 1) % placeholders.length;
      currentCharIndex = 0;
      setTimeout(typeText, 500);
    } else {
      setTimeout(typeText, 1000);
    }
  }
};

const placeholder = computed(() => {
  if (props.chatMode) {
    return "How can Grok help?";
  }
  return currentPlaceholder.value;
});

onMounted(() => {
  if (!props.chatMode) {
    typeText();
  }
});

const toggleFeature = (feature) => {
  if (feature === "attachment") {
    fileInputRef.value?.click();
  } else if (feature === "deepSearch") {
    featuresStore.toggleDeepSearch();
  } else if (feature === "think") {
    featuresStore.toggleThink();
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    Array.from(files).forEach((file) => {
      featuresStore.addFile(file);
    });
  }
  // Reset input value to allow selecting the same file again
  event.target.value = "";
};

const focusInput = (event) => {
  // Prevent focus when clicking buttons or their children
  if (event.target.closest("button")) {
    return;
  }
  // Focus input for all other clicks within the container
  inputRef.value?.focus();
};
</script>

<template>
  <div
    :class="[
      'w-full bg-transparent mx-auto',
      chatMode ? 'max-w-[800px]' : 'max-w-[900px]',
    ]"
  >
    <div
      @click="focusInput"
      :class="[
        'input-container bg-[#333537] rounded-[24px] flex flex-col px-5 py-3 relative transition-all duration-200 group focus-within:shadow-glow focus-within:border-white/20 border border-transparent',
        chatMode ? 'h-[100px]' : 'h-[120px]',
      ]"
    >
      <div class="input-wrapper flex items-center min-h-[32px]">
        <input
          ref="inputRef"
          :value="message"
          @input="emit('update:message', $event.target.value)"
          type="text"
          :placeholder="placeholder"
          class="bg-transparent text-[16px] font-[500] text-gray-200 w-full focus:outline-none placeholder:text-[#8C8F93] leading-relaxed"
          @keyup.enter="emit('send')"
        />
      </div>
      <FilePreview />

      <div
        :class="[
          'flex items-center justify-between select-none',
          chatMode ? 'mt-2' : 'mt-auto',
        ]"
      >
        <div class="flex items-center gap-2">
          <button
            @click="toggleFeature('attachment')"
            class="text-white hover:text-white p-2 rounded-full transition-all duration-200 hover:bg-[#404040] border border-white/10 select-none"
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
          <button
            @click="toggleFeature('deepSearch')"
            class="flex items-center gap-1.5 px-3 py-2 rounded-full text-white hover:text-white transition-all duration-200 border border-white/10 select-none"
            :class="
              featuresStore.deepSearchEnabled
                ? 'bg-white/10 hover:bg-white/15'
                : 'hover:bg-[#404040]'
            "
          >
            <Search class="w-4 h-4" />
            <span class="text-sm font-medium">DeepSearch</span>
          </button>
          <button
            @click="toggleFeature('think')"
            class="flex items-center gap-1.5 px-3 py-2 rounded-full text-white hover:text-white transition-all duration-200 border border-white/10 select-none"
            :class="
              featuresStore.thinkEnabled
                ? 'bg-white/10 hover:bg-white/15'
                : 'hover:bg-[#404040]'
            "
          >
            <Brain class="w-4 h-4" />
            <span class="text-sm font-medium">Think</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <button
              @click="showModelSelector = !showModelSelector"
              class="flex items-center gap-1.5 text-white hover:text-white transition-all duration-200 text-sm px-3 py-1.5 rounded-full hover:bg-[#404040] group"
            >
              <span class="font-medium">{{ selectedModel }}</span>
              <ChevronDown
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="{ 'rotate-180': showModelSelector }"
              />
            </button>
            <div
              v-if="showModelSelector"
              class="absolute top-full mt-2 right-0 bg-[#36383A] rounded-2xl py-3 w-[280px] shadow-xl transform origin-top-right transition-all duration-150 border border-white/[0.06] overflow-hidden z-50"
              v-cloak
            >
              <div class="px-4 pb-3 border-b border-white/[0.06] bg-[#36383A]">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-white text-[13px] font-semibold tracking-tight"
                    >Grok 3</span
                  >
                  <span
                    class="text-[11px] px-1.5 py-[2px] rounded-full bg-white/[0.06] text-[#9BA1A6] font-medium tracking-tight"
                    >beta</span
                  >
                </div>
                <div class="text-[12px] text-[#9BA1A6] tracking-tight">
                  Smartest
                </div>
              </div>

              <div class="px-4 pt-3 bg-[#36383A]">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-0.5">
                    <span
                      class="text-[13px] text-white font-semibold tracking-tight"
                      >Enable Search</span
                    >
                    <span class="text-[12px] text-[#9BA1A6] tracking-tight"
                      >Grok can browse the web</span
                    >
                  </div>
                  <button
                    @click="featuresStore.toggleSearch"
                    class="relative w-[36px] h-[20px] rounded-full transition-colors duration-150"
                    :class="
                      featuresStore.searchEnabled ? 'bg-white' : 'bg-[#404040]'
                    "
                  >
                    <div
                      class="absolute w-[16px] h-[16px] rounded-full top-[2px] transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                      :class="
                        featuresStore.searchEnabled
                          ? 'right-[2px] bg-black'
                          : 'left-[2px] bg-[#36383A]'
                      "
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="emit('send')"
            class="hover:bg-[#404040] p-1.5 rounded-full transition-all duration-200 hover:scale-105"
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
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-2px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.absolute {
  animation: slideIn 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.shadow-glow {
  box-shadow:
    0 0 15px rgba(255, 255, 255, 0.1),
    0 0 5px rgba(255, 255, 255, 0.05);
}

/* Prevent focus styles on buttons */
button:focus {
  outline: none;
}
</style>
