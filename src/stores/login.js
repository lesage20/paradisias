import { defineStore } from "pinia";
import axios from "axios";

export const useLoginStore = defineStore("login", {
  state: () => ({
    loggedIn: false,
    token: null,
    user: { username: undefined },
    permissions: [],
    profile: {},
  }),
  actions: {
    async login(data) {
      this.loggedIn = true;
      this.token = data.access_token;
      this.user = data.user;
    },
    logout() {
      this.loggedIn = false;
      this.token = null;
      this.user = { username: undefined };
      this.permissions = [];
      this.profile = {};
    },
    setProfile(data) {
      this.profile = data;
    },
    setPrerms(data) {
      this.permissions = data;
    },
  },
  persist: true,
});
