<script setup>
import { settings } from './config'; 

import Main from './components/Main.vue';
</script>

<template>
  <mdui-layout style="position: fixed; left: 0; right: 0; top: 0; bottom: 0;">
    <mdui-top-app-bar order="1" scroll-behavior="elevate">
        <mdui-top-app-bar-title>
          {{ settings.title || "realtvop's startpage" }}
        </mdui-top-app-bar-title>
    </mdui-top-app-bar>

    <mdui-layout-main>
      <Main></Main>
    </mdui-layout-main>
  </mdui-layout>
</template>

<style scoped>
mdui-top-app-bar-title {
  margin-left: 0.5rem;
}
</style>
