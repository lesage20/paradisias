<template>
  <q-item
    v-if="!children.length"
    active-class="active-class"
    clickable
    :to="link"
    exact
    class="q-ma-sm rounded-borders"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon color="" :name="icon" aria-hidden="true" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="children.length" side>
      <q-icon name="expand_less"></q-icon>
    </q-item-section>
  </q-item>
  <q-item v-else class="q-pa-none q-ma-sm">
    <q-expansion-item
      :label="title"
      class="q-pa-none full-width"
      :icon="icon ? icon : ''"
    >
      <q-list class="q-pl-xl">
        <q-item
          v-for="child in children"
          :key="child.title"
          v-close-popup
          class="q-py-xs rounded-borders q-my-sm"
          clickable
          :to="child.link"
          active-class="active-class"
          exact
        >
          <q-item-section>
            <q-item-label> {{ child.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: "",
  },

  link: {
    type: String,
    default: "#",
  },

  icon: {
    type: String,
    default: "",
  },
  children: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>
<style>
.active-class {
  background: linear-gradient(to right, teal 20%, rgb(47, 163, 163));
  color: white;
  margin: 0 10px;
}
</style>
