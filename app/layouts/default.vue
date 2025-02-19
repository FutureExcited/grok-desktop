<template>
  <div
    class="bg-[#1D1E20] text-white min-h-screen flex flex-col font-sans antialiased"
  >
    <Header />
    <main class="flex-grow flex flex-col">
      <div class="max-w-[700px] mx-auto px-4 w-full flex-1">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
</script>
