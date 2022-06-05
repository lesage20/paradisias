import { defineStore } from "pinia";

export const generalStore = defineStore(
  "general",
  {
    state: () => ({
      api: "https://paradisias-api.herokuapp.com/",
    }),
  },
  {
    persist: true,
  }
);
