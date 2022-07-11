<template>
  <q-page padding class="flex flex-center">
    <div>
      <q-card
        class="align-item-center"
        :flat="$q.platform.is.desktop"
        :bordered="$q.platform.is.desktop"
        :style="$q.platform.is.desktop ? 'width: 400px;' : ''"
      >
        <h4 class="text-center text-grey-9 q-ma-sm">Connexion</h4>
        <q-card-section class="text-body2 text-grey q-py-none q-my-none">
          <p class="q-my-none q-px-md text-center">
            Connectez vous a votre compte utilisateur pour accéder à
            l'application
          </p>
        </q-card-section>
        <q-card-section class="q-ma-none">
          <q-card-section>
            <div :class="$q.platform.is.desktop ? 'q-px-md' : ''">
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

                <div :class="$q.platform.is.mobile ? 'q-ms-xs' : ''">
                  <q-btn
                    class="full-width"
                    label="Se connecter"
                    type="submit"
                    color="primary"
                    :percentage="percentage"
                    :loading="loading"
                    @click.prevent="login()"
                  >
                    <template #loading>
                      <q-spinner name="facebook"></q-spinner>
                    </template>
                  </q-btn>
                </div>
              </q-form>
            </div>
          </q-card-section>
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
import { useQuasar, QSpinnerCube, QSpinnerFacebook, QSpinnerIos } from "quasar";

const api = inject("api");
const $q = useQuasar();
const username = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const percentage = ref(0);

let config = {
  onUploadProgress: (progressEvent) => {
    percentage.value = progressEvent.loaded;
  },
};
const login = () => {
  loading.value = true;
  const dialog = $q.dialog({
    progress: {
      spinner: QSpinnerIos,
      color: "teal",
    },
    persistant: true,
    title: "Connexion",
    message:
      "Nous sommes entrain de vérifier vos informations veuillez patienter",
    ok: false,
  });

  axios
    .post(
      api + "auth/login/",
      {
        username: username.value,
        password: password.value,
      },
      config
    )
    .then((res) => {
      useLoginStore().login(res.data);
      Boolean(route.redirectedFrom)
        ? router.push(route.redirectedFrom)
        : router.push({ name: "Dashboard" });
      loading.value = false;
      useLoginStore().setPrerms(res.data.user.groups[0].permissions);
      axios
        .get(`${api}accounts/profiles/${res.data.user.profil}`, {
          headers: { Authorization: "Bearer " + useLoginStore().token },
        })
        .then((resp) => {
          useLoginStore().setProfile(resp.data);
        });

      $q.notify("Compte vérifié. Bienvenue à paradisias.");
    })
    .catch((err) => {
      loading.value = false;
      dialog.hide();
      console.dir(err);
      $q.notify({
        message: "Nom d'utilisateur ou mot de passe incorrect",
        position: "top",
      });
    });
};
</script>
