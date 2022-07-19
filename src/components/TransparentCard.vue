<template>
  <q-card flat bordered :class="'text-' + color + '-8 g-' + color + '-2'">
    <q-card-section horizontal>
      <div class="row full-width">
        <div
          v-if="icon"
          :class="'flex flex-center rounded-borders q-pa-md col-xs-5 '"
        >
          <q-avatar size="xl" :class="'bg-' + color + '-3'">
            <q-icon
              size="md"
              style="--fa-animation-iteration-count: 4"
              :color="color + '-8'"
              :name="icon"
            ></q-icon>
          </q-avatar>
        </div>
        <div
          class="q-pa-md text-center"
          :class="{ 'col-xs-7': icon, 'col-xs-12': !icon }"
        >
          <p
            :class="{
              'col-xs-12': true,
              'column reverse q-pa-none q-ma-none ': !icon,
            }"
          >
            <b :class="icon ? 'text-h4' : 'text-h1'">
              {{ number }} <span v-if="!icon">F</span></b
            >
            <br />
            <span>{{ title }}</span> <br />
          </p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  color: String,
  icon: String,
  title: String,
  number: {
    type: Number,
    default: 0,
  },
});
</script>
