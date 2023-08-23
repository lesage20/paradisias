import { defineStore } from "pinia";

export const generalStore = defineStore(
  "general",
  {
    state: () => ({
      api: "http://192.168.1.67:8002/", // "https://paradisias-api.herokuapp.com/",
    }),
  },
  {
    persist: true,
  }
);
