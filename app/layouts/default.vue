<template>
  <div
    class="bg-[#1D1E20] text-white min-h-screen flex flex-col font-sans antialiased"
  >
    <Header />
    <main class="flex-grow flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
</script>
