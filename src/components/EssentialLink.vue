<template>
  <q-item v-if="!children.length" clickable :to="link" exact>
    <q-item-section v-if="icon" avatar>
      <q-icon color="" :name="icon" aria-hidden="true" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label class="text-grey-8" caption>{{ caption }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="children.length" side>
      <q-icon name="expand_less"></q-icon>
    </q-item-section>
  </q-item>
  <q-item v-else class="q-pa-none">
    <q-expansion-item :label="title" class="q-pa-none" :icon="icon ? icon : ''">
      <q-list class="q-pl-xl">
        <q-item
          v-for="child in children"
          :key="child.title"
          v-close-popup
          class="q-py-xs"
          clickable
          :to="child.link"
          exact
        >
          <span class="q-pr-md" style="font-size: x-large"> &bullet; </span>

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
