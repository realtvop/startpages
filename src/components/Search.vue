<script setup>
import { settings } from '../config';
import { showSnackBar } from '../utils/snackBar';
</script>

<script>
export default {
    data() {
        return {
            selectedEngine: settings.searchEngines[0],
            keyword: "",
        };
    },
    mounted() {
    },
    methods: {
        doSearch() {
            if (!this.selectedEngine || !this.selectedEngine.url) showSnackbar("Err: No search engine selected.")
            let url = this.selectedEngine.url;
            if (
                !url.startsWith("//") &&
                !url.startsWith("http://") &&
                !url.startsWith("https://")
            ) url = `//${url}`;
            if (!url.includes("%keyword%")) url += "%keyword%";
            location.href = url.replace("%keyword%", this.keyword);
        },
    }
};
</script>

<template>
    <div class="search">
        <!-- <mdui-select value="item-1" label="Search engine">
            <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
            <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
        </mdui-select> -->
        <mdui-text-field :label="`Search ${selectedEngine.name}`" clearable @input="keyword = $event.target.value" @keyup.enter="doSearch" helper="↑ Choose search engine">
            <mdui-dropdown slot="icon">
                <!-- <mdui-button slot="trigger" icon="search">{{ selectedEngine.name }}</mdui-button> -->
                <mdui-button-icon slot="trigger" icon="search" variant="filled"></mdui-button-icon>
                <!-- <mdui-button slot="trigger" icon="search"></mdui-button> -->
                <mdui-menu>
                    <mdui-menu-item v-for="searchEngine in settings.searchEngines" @click="selectedEngine = searchEngine; selectedEngine.id = settings.searchEngines.indexOf(searchEngine)" :selected="selectedEngine.id == settings.searchEngines.indexOf(searchEngine)">{{ searchEngine.name }}</mdui-menu-item>
                </mdui-menu>
            </mdui-dropdown>
            <mdui-button-icon slot="end-icon" icon="arrow_forward" @click="doSearch"></mdui-button-icon>
        </mdui-text-field>
    </div>
</template>

<style scoped>
.search {
    display: flex;
    width: 100%;
    align-items: center;
}
</style>