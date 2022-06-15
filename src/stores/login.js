import { defineStore } from "pinia";
import axios from "axios";

function getProfile(id) {
  const profile = {};
  axios.get(`http://127.0.0.1:800/auth/accounts/profiles/${id}`).then((res) => {
    profile = res.data;
  });
  return profile;
}
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
      this.profile = await axios
        .get(`http://127.0.0.1:800/auth/accounts/profiles/${data.user.profil}`)
        .then((res) => res.data);
    },
    logout() {
      this.loggedIn = false;
      this.token = null;
      this.user = { username: undefined };
      this.permissions = [];
    },
  },
  persist: true,
});
