<script setup>
import Search from './Search.vue';
import Content from './Content.vue';
import Clock from './Clock.vue';
</script>

<script>
export default {
    data() {
        return {
            fullscreenClock: false,
        };
    },
    mounted() {
    },
}
</script>

<template>
    <main>
        <Clock v-if="$attrs.userConfig.showClock" :fullscreen="fullscreenClock" @click="fullscreenClock = !fullscreenClock"></Clock>

        <Search :searchEngines="$attrs.config.searchEngines" v-if="!fullscreenClock"></Search>
        <Content :pages="$attrs.config.pages" v-if="!fullscreenClock"></Content>
    </main>
</template>

<style scoped>
main {
    height: 100%;
    width: calc(100% - 4rem);
    padding-left: 2rem;
    padding-right: 2rem;
    overflow-x: hidden;
}
</style>