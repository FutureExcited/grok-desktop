<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html {
  scroll-behavior: smooth;
  overflow-y: auto;
  background: #1e1f20;
  color: #f9f8f6;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

* {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}

* {
  box-sizing: border-box;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
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

/* Firefox scrollbar styling */
* {
  scrollbar-width: thin;
  scrollbar-color: #333537 transparent;
}
</style>
