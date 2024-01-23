<script setup>
import Search from './Search.vue';
import Content from './Content.vue';
import Clock from './Clock.vue';
</script>

<script>
export default {
    data() {
        return {
        };
    },
    mounted() {
    },
}
</script>

<template>
    <main>
        <Clock v-if="$attrs.userConfig.showClock"></Clock>

        <Search :searchEngines="$attrs.config.searchEngines"></Search>

        <!-- <mdui-divider></mdui-divider> -->

        <Content :pages="$attrs.config.pages"></Content>
    </main>
</template>

<style scoped>
main {
    height: 100%;
    width: calc(100% - 4rem);
    padding-left: 2rem;
    padding-right: 2rem;
}
</style>