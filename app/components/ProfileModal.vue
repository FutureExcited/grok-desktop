<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Settings, HelpCircle, LogOut } from "lucide-vue-next";

const isOpen = ref(false);
const modalRef = ref(null);

const toggleModal = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    modalRef.value &&
    !modalRef.value.contains(event.target)
  ) {
    // Check if the click target is not the avatar button (which would have data-profile-trigger)
    if (!event.target.closest("[data-profile-trigger]")) {
      isOpen.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

defineExpose({
  toggleModal,
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="modalRef"
        class="absolute top-[60px] right-6 bg-[#222222] rounded-2xl shadow-lg border border-[#2A2A2A] overflow-hidden"
        style="z-index: 1000"
      >
        <div class="py-0.5">
          <button
            v-for="(item, index) in [
              { icon: Settings, text: 'Settings' },
              { icon: HelpCircle, text: 'Help & Feedback' },
              { icon: LogOut, text: 'Sign Out' },
            ]"
            :key="index"
            class="rounded-xl w-full flex items-center gap-3 px-4 py-2.5 text-[#E5E5E5] hover:bg-[#2A2A2A] transition-colors duration-200 text-[15px]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.text }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
