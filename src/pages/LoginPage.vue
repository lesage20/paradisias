<template>
  <q-page
    :padding="$q.platform.is.desktop"
    :class="$q.platform.is.desktop ? 'flex flex-center' : 'column'"
  >
    <!-- desktop display -->
    <div class="desktop-only">
      <q-card class="align-item-center" style="width: 400px" flat bordered>
        <h4 class="text-center text-grey-9 q-ma-sm">Connexion</h4>
        <q-card-section class="text-body2 text-grey q-py-none q-my-none">
          <p class="q-my-none q-px-md text-center">
            Connectez vous a votre compte utilisateur pour accéder à
            l'application
          </p>
        </q-card-section>
        <q-card-section class="q-ma-none">
          <q-card-section>
            <div class="q-px-md">
              <q-form class="q-gutter-md">
                <q-input
                  v-model="username"
                  prepend="fa fa-lock"
                  label="Nom d'utilisateur *"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="fa fa-user"></q-icon>
                  </template>
                </q-input>

                <q-input
                  v-model="password"
                  type="password"
                  placeholder="Mot de passe"
                  name="password"
                  label="Mot de passe"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val !== null && val !== '') ||
                      'Veuillez entrer votre mot de passe',
                  ]"
                >
                  <template #prepend>
                    <q-icon name="fa fa-lock"></q-icon>
                  </template>
                </q-input>

                <div>
                  <q-btn
                    class="full-width"
                    label="Submit"
                    type="submit"
                    color="primary"
                    :loading="loading"
                    @click.prevent="login()"
                  />
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <!-- mobile display -->
    <div class="mobile-only">
      <q-card class="align-item-center bg-transparent" style="width: 100%" flat>
        <h3 class="text-center text-grey-9 q-ma-sm">Connexion</h3>
        <q-card-section class="text-body1 text-grey q-py-none q-my-none">
          <p class="q-my-none q-px-md text-center">
            Connectez vous a votre compte utilisateur pour accéder à
            l'application
          </p>
        </q-card-section>
        <q-card-section>
          <div class="q-px-none">
            <q-form class="q-gutter-md">
              <q-input
                v-model="username"
                prepend="fa fa-lock"
                label="Nom d'utilisateur *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              >
                <template #prepend>
                  <q-icon name="fa fa-user"></q-icon>
                </template>
              </q-input>

              <q-input
                v-model="password"
                type="password"
                placeholder="Mot de passe"
                name="password"
                label="Mot de passe"
                lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') ||
                    'Veuillez entrer votre mot de passe',
                ]"
              >
                <template #prepend>
                  <q-icon name="fa fa-lock"></q-icon>
                </template>
              </q-input>
              <q-space vertical></q-space>
              <div>
                <q-btn
                  class="full-width"
                  label="Submit"
                  type="submit"
                  color="primary"
                  :loading="loading"
                  @click.prevent="login()"
                />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { inject, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLoginStore } from "src/stores/login";
import axios from "axios";
import { useQuasar } from "quasar";

const api = inject("api");
const $q = useQuasar();
console.log($q.platform);
const username = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const login = () => {
  loading.value = true;
  axios
    .post(api + "auth/login/", {
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      loading.value = false;
      console.log(res.data);
      useLoginStore().login(res.data);
      $q.notify("Bienvenue à paradisias.");
      Boolean(route.redirectedFrom)
        ? router.push(route.redirectedFrom)
        : router.push({ name: "Dashboard" });
    })
    .catch((err) => {
      loading.value = false;
      $q.notify({
        message: "Nom d'utilisateur ou mot de passe incorrect",
        position: "top",
      });
    });
  // if (username.value === "admin" && password.value === "admin") {
  //   useLoginStore().login();
  //   Boolean(route.redirectedFrom)
  //     ? router.push(route.redirectedFrom)
  //     : router.push({ name: "Dashboard" });
  // }
};
</script>
<style>
.column {
  display: flex !important;
  justify-content: end !important;
  align-items: flex-end !important;
  align-content: flex-end !important;
  justify-items: end !important;
  flex-direction: column !important;
}
</style>
