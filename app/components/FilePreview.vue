<script setup lang="ts">
import { X, FileText, Image as ImageIcon } from "lucide-vue-next";
import { useFeaturesStore } from "~~/app/stores/features";
import type { FileInfo } from "~~/app/stores/features";

const featuresStore = useFeaturesStore();

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};
</script>

<template>
  <div
    v-if="featuresStore.attachedFiles.length > 0"
    class="mt-2 transition-all duration-300 ease-in-out"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="file in featuresStore.attachedFiles"
        :key="file.name"
        :class="[
          'group transition-all duration-200 transform hover:-translate-y-0.5 border border-white/10',
          file.isImage
            ? 'rounded-2xl overflow-hidden bg-black/20 hover:bg-black/30'
            : 'flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/[0.07] rounded-full',
        ]"
      >
        <!-- Image Preview -->
        <div v-if="file.isImage" class="relative">
          <img
            :src="file.base64Content"
            :alt="file.name"
            class="w-[120px] h-[120px] object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <div class="absolute bottom-2 left-3 right-3">
              <div class="text-sm text-white font-medium leading-none truncate">
                {{ file.name }}
              </div>
              <div class="text-xs text-white/70 mt-0.5">
                {{ formatFileSize(file.size) }}
              </div>
            </div>
          </div>
          <button
            @click="featuresStore.removeFile(file.name)"
            class="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-200 transform hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
          >
            <X class="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <!-- File Info (for non-images) -->
        <template v-else>
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
            class="ml-2 p-1 rounded-full hover:bg-white/10 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <X class="w-3.5 h-3.5 text-white/70" />
          </button>
        </template>
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
