<template>
  <div class="q-pa-none">
    <q-carousel height="100vh" swipeable animated v-model="slide" thumbnails infinite>
      <q-carousel-slide class="flex flex-center " :name="index" :img-src="url" v-for="(url, index) in images"
        :key="url">
        <div class="row justify-center">
          <div class="col-sm-10 col-md-8 text-center">
            <q-card dark class="bg-light-dark  pa-md">
              <q-card-section class="text-grey-4" :class="{ 'text-h4': $q.screen.gt.sm, 'text-h5': $q.screen.lt.md, }">
                Dormez en toute tranquilité à Paradisias Hotel
              </q-card-section>
              <q-card-section class="text-body1 text-grey-5 px-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, aliquid. Magnam, amet sed libero et
                tempore ullam, perferendis aliquid expedita iste vero quos facere. Adipisci, aliquid ea. Facere, impedit
                unde?
              </q-card-section>
              <q-card-section>
                <q-btn no-caps="" class="text-grey-5" color="teal-8" size="lg">
                  <q-icon size="md" color="#70161e" left name="fa-solid fa-tags">
                  </q-icon>
                  Reservez une chambre
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>

</template>
<script setup>
import { ref } from 'vue'

const slide = ref(0)
const images = ["https://cdn.pixabay.com/photo/2018/01/06/18/40/relaxation-3065577_960_720.jpg", "https://cdn.pixabay.com/photo/2014/05/17/18/03/lobby-346426_960_720.jpg",
  "https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_960_720.jpg",]
</script>
<style scoped>
.bg-covered {
  position: relative;
}

.bg-covered::after {
  background: linear-gradient(to right, rgb(0, 0, 0, .5), rgb(0, 0, 0, .5)) cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  content: "Ange aymar";
}

.bg-light-dark {
  background: linear-gradient(to right, rgb(0, 0, 0, .7), rgb(0, 0, 0, .7));
}
</style>
