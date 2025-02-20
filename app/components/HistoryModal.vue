<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useHistoryStore } from "~~/app/stores/history";
import {
  Search,
  PenSquare,
  Ghost,
  Brain,
  Palette,
  Share,
} from "lucide-vue-next";
import type { LucideIcon } from "lucide-vue-next";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  isCurrent?: boolean;
  isTemporary?: boolean;
}

interface ActionShortcut {
  text: string;
  shortcut: string;
}

interface HistoryAction {
  text: string;
  shortcut: string;
  action: () => void;
}

interface ActionItem extends ActionShortcut {
  icon: LucideIcon;
  onClick?: () => void;
  bg?: string;
}

const historyStore = useHistoryStore();
const { todayItems, yesterdayItems } = storeToRefs(historyStore);
const router = useRouter();
const searchQuery = ref("");
const activeItem = ref<string | null>(null);
const activeAction = ref<ActionShortcut | null>(null);

const shortcuts = {
  createChat: { text: "Create New Chat", shortcut: "⌘N" },
  tempChat: { text: "Create Temporary Chat", shortcut: "⌘T" },
  switchModel: { text: "Switch Model", shortcut: "⌘M" },
  switchTheme: { text: "Switch Theme", shortcut: "⌘K" },
  share: { text: "Share Chat", shortcut: "⌘S" },
} as const;

const historyActions = (id: string): HistoryAction[] => [
  { text: "Go", shortcut: "↵", action: () => navigateToChat(id) },
  { text: "Edit", shortcut: "⌘E", action: () => console.log("Edit", id) },
  {
    text: "Delete",
    shortcut: "⌘⌫",
    action: () => historyStore.removeHistoryItem(id),
  },
];

const filteredTodayItems = computed(() => {
  const filtered = todayItems.value.filter(
    (item: HistoryItem) =>
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  return filtered.slice(0, 4);
});

const filteredYesterdayItems = computed(() => {
  const filtered = yesterdayItems.value.filter(
    (item: HistoryItem) =>
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  return filtered.slice(0, 4);
});

const shouldShowScrollbar = computed(() => {
  const totalItems = todayItems.value.length + yesterdayItems.value.length;
  return totalItems > 4;
});

const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  return new Date(timestamp)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();
};

const navigateToChat = (id: string) => {
  historyStore.setCurrentChat(id);
  router.push(`/chat/${id}`);
  historyStore.toggleModal();
};

const createNewChat = () => {
  router.push("/");
  historyStore.toggleModal();
};

const createTemporaryChat = () => {
  const id = crypto.randomUUID();
  historyStore.addHistoryItem({
    title: "New Temporary Chat",
    isTemporary: true,
  });
  router.push(`/chat/${id}`);
  historyStore.toggleModal();
};

const handleActionHover = (shortcut: ActionShortcut | null) => {
  activeAction.value = shortcut;
};

const handleHistoryHover = (id: string | null) => {
  activeItem.value = id;
};

const actions: ActionItem[] = [
  {
    icon: PenSquare,
    ...shortcuts.createChat,
    onClick: createNewChat,
    bg: "bg-[#333537]",
  },
  { icon: Ghost, ...shortcuts.tempChat, onClick: createTemporaryChat },
  { icon: Brain, ...shortcuts.switchModel },
  { icon: Palette, ...shortcuts.switchTheme },
  { icon: Share, ...shortcuts.share },
];
</script>

<template>
  <div
    v-if="historyStore.isModalOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-start justify-center"
    @click="historyStore.toggleModal"
  >
    <div
      class="bg-[#1E1F20] w-[640px] mt-[48px] rounded-[24px] shadow-2xl border border-white/[0.06] animate-modal relative max-h-[60vh] flex flex-col"
      @click.stop
    >
      <!-- Scrollable Content -->
      <div
        class="overflow-y-auto flex-grow"
        :class="{ 'show-scrollbar': shouldShowScrollbar }"
      >
        <!-- Search -->
        <div class="p-5 border-b border-white/[0.06]">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full bg-[#333537] text-[16px] text-[#F9F8F6] placeholder-[#8C8F93] rounded-[18px] py-3.5 pl-12 pr-5 outline-none border border-transparent transition-all duration-200 hover:bg-[#3A3C3E] focus:border-white/20 focus:shadow-glow font-[450]"
            />
            <Search
              class="w-[20px] h-[20px] text-[#8C8F93] absolute left-5 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 py-5 border-b border-white/[0.06]">
          <h3 class="text-[14px] font-[500] text-[#8C8F93] px-2 mb-3">
            Actions
          </h3>
          <div class="space-y-[3px]">
            <button
              v-for="(action, i) in actions"
              :key="i"
              @click="action.onClick?.() ?? null"
              @mouseenter="handleActionHover(action)"
              @mouseleave="handleActionHover(null)"
              class="w-full flex items-center gap-3.5 px-4 py-3 rounded-[18px] text-[16px] font-[450] text-[#F9F8F6] transition-all duration-200"
              :class="[action.bg || 'hover:bg-white/[0.06]']"
            >
              <component
                :is="action.icon"
                class="w-[20px] h-[20px]"
                :strokeWidth="2"
              />
              {{ action.text }}
            </button>
          </div>
        </div>

        <!-- History -->
        <div class="pb-16">
          <!-- Today -->
          <div v-if="filteredTodayItems.length > 0" class="px-4 py-5">
            <h3 class="text-[14px] font-[500] text-[#8C8F93] px-2 mb-3">
              Today
            </h3>
            <div class="space-y-[3px]">
              <button
                v-for="item in filteredTodayItems"
                :key="item.id"
                @click="navigateToChat(item.id)"
                @mouseenter="handleHistoryHover(item.id)"
                @mouseleave="handleHistoryHover(null)"
                class="w-full flex items-center justify-between px-4 py-3 rounded-[18px] text-[16px] font-[450] transition-all duration-200 group"
                :class="
                  item.isCurrent ? 'bg-white/[0.06]' : 'hover:bg-white/[0.06]'
                "
              >
                <div class="flex items-center gap-2.5">
                  <span class="text-[#F9F8F6]">{{ item.title }}</span>
                  <span
                    v-if="item.isCurrent"
                    class="text-[12px] px-2 py-[3px] rounded-full bg-white/[0.08] text-[#9BA1A6] font-[500] tracking-tight"
                    >Current</span
                  >
                </div>
                <span class="text-[14px] text-[#8C8F93]">{{
                  formatTime(item.timestamp)
                }}</span>
              </button>
            </div>
          </div>

          <!-- Yesterday -->
          <div v-if="filteredYesterdayItems.length > 0" class="px-4 pb-5">
            <h3 class="text-[14px] font-[500] text-[#8C8F93] px-2 mb-3">
              Yesterday
            </h3>
            <div class="space-y-[3px]">
              <button
                v-for="item in filteredYesterdayItems"
                :key="item.id"
                @click="navigateToChat(item.id)"
                @mouseenter="handleHistoryHover(item.id)"
                @mouseleave="handleHistoryHover(null)"
                class="w-full flex items-center justify-between px-4 py-3 rounded-[18px] text-[16px] font-[450] hover:bg-white/[0.06] transition-all duration-200"
              >
                <span class="text-[#F9F8F6]">{{ item.title }}</span>
                <span class="text-[14px] text-[#8C8F93]">{{
                  formatTime(item.timestamp)
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Description Row -->
      <div
        class="absolute bottom-0 left-0 right-0 h-14 bg-[#1E1F20] border-t border-white/[0.06] px-5 flex items-center justify-end"
      >
        <div class="flex items-center gap-2.5 text-[14px]">
          <template v-if="activeItem">
            <div
              v-for="action in historyActions(activeItem)"
              :key="action.text"
              class="flex items-center gap-2"
            >
              <span class="text-[#8C8F93] font-[450]">{{ action.text }}</span>
              <span class="text-[#8C8F93] opacity-60 text-[13px] font-mono"
                >({{ action.shortcut }})</span
              >
              <span
                v-if="action !== historyActions(activeItem).at(-1)"
                class="text-[#8C8F93] mx-1.5"
                >·</span
              >
            </div>
          </template>
          <template v-else-if="activeAction">
            <span class="text-[#8C8F93] font-[450]">{{
              activeAction.text
            }}</span>
            <span class="text-[#8C8F93] opacity-60 text-[13px] font-mono"
              >({{ activeAction.shortcut }})</span
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-modal {
  animation: modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.shadow-glow {
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.12),
    0 0 8px rgba(255, 255, 255, 0.06);
}

/* Custom scrollbar for the modal */
.overflow-y-auto {
  scroll-behavior: smooth;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #333537;
  border-radius: 999px;
  border: 2px solid #1e1f20;
  transition: background-color 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #444648;
}

/* Hide scrollbar by default */
.overflow-y-auto:not(.show-scrollbar)::-webkit-scrollbar {
  display: none;
}

/* Show scrollbar only when needed */
.show-scrollbar::-webkit-scrollbar {
  width: 8px;
  display: block;
}
</style>
