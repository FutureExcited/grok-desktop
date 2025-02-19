import { defineStore } from "pinia";
import { ref } from "vue";

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content?: string | ArrayBuffer | null;
}

export const useFeaturesStore = defineStore(
  "features",
  () => {
    const deepSearchEnabled = ref(false);
    const thinkEnabled = ref(false);
    const searchEnabled = ref(true);
    const attachedFiles = ref<FileInfo[]>([]);

    const toggleDeepSearch = () => {
      deepSearchEnabled.value = !deepSearchEnabled.value;
    };

    const toggleThink = () => {
      thinkEnabled.value = !thinkEnabled.value;
    };

    const toggleSearch = () => {
      searchEnabled.value = !searchEnabled.value;
    };

    const addFile = (file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        attachedFiles.value.push({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          content: reader.result,
        });
      };

      reader.readAsText(file);
    };

    const removeFile = (fileName: string) => {
      attachedFiles.value = attachedFiles.value.filter(
        (f) => f.name !== fileName
      );
    };

    const clearFiles = () => {
      attachedFiles.value = [];
    };

    return {
      deepSearchEnabled,
      thinkEnabled,
      searchEnabled,
      attachedFiles,
      toggleDeepSearch,
      toggleThink,
      toggleSearch,
      addFile,
      removeFile,
      clearFiles,
    };
  },
  {
    persist: true,
  }
);
