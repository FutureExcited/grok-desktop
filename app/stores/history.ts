import { defineStore } from "pinia";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  isCurrent?: boolean;
  isTemporary?: boolean;
}

interface HistoryState {
  items: HistoryItem[];
  isModalOpen: boolean;
}

export const useHistoryStore = defineStore("history", {
  state: (): HistoryState => ({
    items: [
      {
        id: crypto.randomUUID(),
        title: "Brief Casual Greeting Exchange",
        timestamp: Date.now(),
        isCurrent: true,
      },
      {
        id: crypto.randomUUID(),
        title: "Debugging React Performance Issues",
        timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
      },
      {
        id: crypto.randomUUID(),
        title: "Setting Up Docker Environment",
        timestamp: Date.now() - 45 * 60 * 1000, // 45 minutes ago
      },
      {
        id: crypto.randomUUID(),
        title: "Code Review Discussion",
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      },
      {
        id: crypto.randomUUID(),
        title: "API Integration Planning",
        timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
      },
      {
        id: crypto.randomUUID(),
        title: "Database Schema Design",
        timestamp: Date.now() - 20 * 60 * 60 * 1000, // 20 hours ago
      },
      {
        id: crypto.randomUUID(),
        title: "Frontend Architecture Discussion",
        timestamp: Date.now() - 24 * 60 * 60 * 1000, // 24 hours ago (yesterday)
      },
      {
        id: crypto.randomUUID(),
        title: "Security Best Practices Review",
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago (yesterday)
      },
      {
        id: crypto.randomUUID(),
        title: "CI/CD Pipeline Setup",
        timestamp: Date.now() - 30 * 60 * 60 * 1000, // 30 hours ago (yesterday)
      },
    ],
    isModalOpen: false,
  }),

  getters: {
    todayItems: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return state.items.filter((item) => new Date(item.timestamp) >= today);
    },

    yesterdayItems: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return state.items.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= yesterday && itemDate < today;
      });
    },
  },

  actions: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },

    addHistoryItem(item: Omit<HistoryItem, "id" | "timestamp">) {
      this.items.unshift({
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      });
    },

    setCurrentChat(id: string) {
      this.items = this.items.map((item) => ({
        ...item,
        isCurrent: item.id === id,
      }));
    },

    removeHistoryItem(id: string) {
      this.items = this.items.filter((item) => item.id !== id);
    },
  },
});
