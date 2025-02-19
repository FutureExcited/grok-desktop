<script setup lang="ts">
import { X, FileText } from "lucide-vue-next";
import { useFeaturesStore } from "~/stores/features";
import type { FileInfo } from "~/stores/features";

const featuresStore = useFeaturesStore();

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};
</script>

<template>
  <div v-if="featuresStore.attachedFiles.length > 0" class="mt-2">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="file in featuresStore.attachedFiles"
        :key="file.name"
        class="group flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/[0.07] rounded-full border border-white/10 transition-all duration-200"
      >
        <FileText class="w-4 h-4 text-white/70" />
        <div class="flex flex-col">
          <span class="text-sm text-white font-medium leading-none">{{
            file.name
          }}</span>
          <span class="text-xs text-white/50">{{
            formatFileSize(file.size)
          }}</span>
        </div>
        <button
          @click="featuresStore.removeFile(file.name)"
          class="ml-2 p-1 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          <X class="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
