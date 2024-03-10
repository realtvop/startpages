<script setup>
import Search from './Search.vue';
import Content from './Content.vue';
import Clock from './Clock.vue';
import DaysCountdown from './DaysCountdown.vue';
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
        <Clock v-if="$attrs.userConfig.showClock" :fullscreen="fullscreenClock" :showLunarDate="$attrs.userConfig.showLunarDate" @click="fullscreenClock = !fullscreenClock" :countdownevents="$attrs.config.countdownEvents"></Clock>

        <Search :searchEngines="$attrs.config.searchEngines" :autofocus="$attrs.userConfig.autoFocusSearchBar" v-if="!fullscreenClock || !$attrs.userConfig.showClock"></Search>
        <DaysCountdown v-if="!fullscreenClock || !$attrs.userConfig.showClock" :events="$attrs.config.countdownEvents"></DaysCountdown>
        <Content :pages="$attrs.config.pages" v-if="!fullscreenClock || !$attrs.userConfig.showClock"></Content>
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