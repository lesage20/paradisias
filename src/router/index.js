import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import axios from "axios";
import { useLoginStore } from "../stores/login";
import { inject } from "vue";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  const api = process.env.DEV
    ? "http://192.168.43.108:8000/"
    : "https://paradisias-api.herokuapp.com/";

  Router.beforeEach(async (to, from) => {
    if (to.name !== "Login") {
      if (!Boolean(useLoginStore().token)) return { name: "Login" };
      const isVerified = axios
        .post(
          api + "auth/token/verify/",
          { token: useLoginStore().token },
          { headers: { Authorization: "Bearer " + useLoginStore().token } }
        )
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.dir(err);
          return false;
        });
      if (!isVerified) return { name: "Login" };
    }
  });

  Router.afterEach((to, from) => {
    if (from.name == "Login") {
      location.reload();
    }
  });
  return Router;
});
