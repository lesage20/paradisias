<template>
  <div>
    <q-ajax-bar color="primary" style="height: 4px"></q-ajax-bar>

    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isOnLine = ref(navigator.onLine)
window.onoffline = (e) => {
  isOnLine.value = false
}
window.ononline = (e) => {
  isOnLine.value = true
}
if (!isOnLine.value) {
  $q.notify('Vous êtes hors connexion.')
}
provide('isOnline', isOnLine)

if (false) {
  provide("api", "http://192.168.43.108:8000/");
} else {
  provide("api", "https://paradisias-api.herokuapp.com/");
}

</script>
<style lang="scss">
.funspinner {
  display: flex;
  flex-wrap: wrap;

  &__box {
    width: 25vw;
    height: 25vw;
    margin: 0 0 0 -1px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &>b {
      top: 1rem;
      left: 1rem;
      position: absolute;
      font-weight: normal;
    }

    &>div {
      width: 20%;
      height: 20%;
      text-align: center;
    }

    svg {
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }
  }
}

div.progresser {
  width: 6rem;
  height: auto;

  &__bar {
    width: 6rem;
    height: 0.7rem;
    border-radius: 1rem;
    overflow: hidden;
    background-color: $secondary;

    &-item {
      width: 3rem;
      height: 0.7rem;
      margin: 0 0 0 -2rem;
      border-radius: 1rem;
      background-color: $teal;
      animation: progresser 1.5s infinite cubic-bezier(0.76, 0, 0.24, 1);
    }
  }
}

@keyframes progresser {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(7rem);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
