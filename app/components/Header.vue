<script setup>
import { User, Settings, HelpCircle, History, Ghost } from "lucide-vue-next";
import { useHistoryStore } from "~~/app/stores/history";
import HistoryModal from "~~/app/components/HistoryModal.vue";
import ProfileModal from "~~/app/components/ProfileModal.vue";
import { ref } from "vue";

const historyStore = useHistoryStore();
const profileModalRef = ref(null);
</script>

<template>
  <header class="w-full">
    <HistoryModal />
    <ProfileModal ref="profileModalRef" />
    <div class="container-fluid px-6">
      <div class="flex justify-between items-center h-[60px]">
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 rounded-xl"
          >
            <img src="/logo.png" alt="Logo" class="size-8" />
            <svg
              width="51"
              height="17"
              viewBox="38 11 51 17"
              fill="currentColor"
              class="text-white"
            >
              <path
                d="M45.9006 27.981C40.951 27.981 38 24.4168 38 19.5567C38 14.6508 41.0564 11 45.9972 11C49.8579 11 52.6845 12.9623 53.3509 16.6132H50.3865C49.9498 14.5368 48.2033 13.3731 45.9972 13.3731C42.4352 13.3731 40.8726 16.4306 40.8726 19.5567C40.8726 22.6827 42.4352 25.7174 45.9972 25.7174C49.3983 25.7174 50.892 23.2759 51.0069 21.2452H45.8823V18.8825H53.6267L53.6141 20.1178C53.6141 24.7079 51.7278 27.981 45.9006 27.981Z"
              />
              <path
                d="M55.832 27.6795V17.7538L58.0151 15.8828H62.6572V18.0733H58.4288V27.6795H55.832Z"
              />
              <path
                d="M69.0106 27.9531C65.1499 27.9531 63.0586 25.2378 63.0586 21.7695C63.0586 18.2784 65.1499 15.5859 69.0106 15.5859C72.8943 15.5859 74.9625 18.2784 74.9625 21.7695C74.9625 25.2378 72.8943 27.9531 69.0106 27.9531ZM65.7703 21.7695C65.7703 24.462 67.2411 25.8083 69.0106 25.8083C70.803 25.8083 72.2508 24.462 72.2508 21.7695C72.2508 19.0771 70.803 17.708 69.0106 17.708C67.2411 17.708 65.7703 19.0771 65.7703 21.7695Z"
              />
              <path
                d="M76.8828 27.6805V11.3887H79.4796V22.1407L84.9719 15.8838H88.1202L83.1794 21.246L88.1662 27.6805H85.0638L81.0247 22.1516L79.4796 22.1407V27.6805H76.8828Z"
              />
            </svg>
          </NuxtLink>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative group">
            <button
              class="hover:bg-[#2A2A2A]/90 size-10 rounded-full transition-all duration-200 text-[#E5E5E5] hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <Ghost class="w-5 h-5" />
            </button>
            <div
              class="absolute top-full mt-3 right-0 w-44 p-2.5 bg-[#2A2A2A] rounded-2xl text-sm text-[#E5E5E5] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg shadow-black/20 backdrop-blur-sm border border-white/5 transform group-hover:translate-y-0 translate-y-1 z-50"
            >
              <span
                class="font-medium whitespace-nowrap overflow-hidden text-ellipsis block"
                >Switch to Temporary Chat</span
              >
              <div
                class="absolute -top-1.5 right-5 w-3 h-3 bg-[#2A2A2A] rotate-45 border-l border-t border-white/5"
              ></div>
            </div>
          </div>
          <div class="relative group">
            <button
              class="hover:bg-[#2A2A2A]/90 size-10 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              @click="historyStore.toggleModal"
            >
              <History class="w-5 h-5 text-[#E5E5E5]" />
            </button>
            <div
              class="absolute top-full mt-3 right-0 w-20 p-2.5 bg-[#2A2A2A] rounded-2xl text-sm text-[#E5E5E5] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg shadow-black/20 backdrop-blur-sm border border-white/5 transform group-hover:translate-y-0 translate-y-1 z-50"
            >
              <span
                class="font-medium whitespace-nowrap overflow-hidden text-ellipsis block"
                >History</span
              >
              <div
                class="absolute -top-1.5 right-5 w-3 h-3 bg-[#2A2A2A] rotate-45 border-l border-t border-white/5"
              ></div>
            </div>
          </div>
          <button
            class="hover:bg-[#2A2A2A]/90 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 size-10 flex items-center justify-center overflow-hidden"
            @click="profileModalRef?.toggleModal()"
            data-profile-trigger
          >
            <img
              src="/avatar.webp"
              alt="Profile"
              class="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
