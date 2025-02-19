<script setup>
import {
  Search,
  Lightbulb,
  BarChart2,
  FileText,
  Image,
  Code,
} from "lucide-vue-next";

const actions = [
  {
    icon: FileText,
    label: "Research",
  },
  {
    icon: Lightbulb,
    label: "Brainstorm",
  },
  {
    icon: BarChart2,
    label: "Analyze Data",
  },
  {
    icon: Image,
    label: "Create Images",
  },
  {
    icon: Code,
    label: "Code",
  },
];
</script>

<template>
  <div class="flex justify-center gap-1.5">
    <button
      v-for="action in actions"
      :key="action.label"
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#404040]/30 transition-colors duration-200 group"
    >
      <component
        :is="action.icon"
        class="w-[18px] h-[18px] text-[#8E8E8E] group-hover:text-white transition-colors duration-200"
      />
      <div
        class="text-[13px] font-medium text-[#8E8E8E] group-hover:text-white"
      >
        {{ action.label }}
      </div>
    </button>
  </div>
</template>
