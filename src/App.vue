<script setup>
import Main from './components/Main.vue';
</script>

<script>
export default {
    data() {
        return {
            config: {},
        };
    },
    mounted() {
        const configURL = localStorage.getItem("config") || localStorage.setItem("config", "/demo.json") || "/demo.json";
        fetch(configURL)
            // .then(r => r.json())
            .then(r => r.text())
            .then(t => JSON.parse(t))
            .then(j => {
              this.config = j;
              window.mdui.setColorScheme(j.color || "#64c8ff");
            });
    },
    watch: {
      config: {
        handler(newVal) {
          // globalConfig = this.config = newVal;
        },
      },
    },
}
</script>

<template>
  <mdui-layout style="position: fixed; left: 0; right: 0; top: 0; bottom: 0;">
    <mdui-top-app-bar order="1" scroll-behavior="elevate">
        <mdui-top-app-bar-title>
          {{ config.title || "realtvop's startpage" }}
        </mdui-top-app-bar-title>
    </mdui-top-app-bar>

    <mdui-layout-main>
      <Main :config="config"></Main>
    </mdui-layout-main>
  </mdui-layout>
</template>

<style scoped>
mdui-top-app-bar-title {
  margin-left: 0.5rem;
}
</style>
