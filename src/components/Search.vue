<script setup>
import { showSnackBar } from '../utils/snackBar';
import { formatExternalURL } from '../utils/formatURL';
</script>

<script>
export default {
    data() {
        return {
            searchEngines: [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }],
            selectedEngine: { name: "Google", url: "https://www.google.com/search?q=%keyword%" },
            keyword: "",
        };
    },
    mounted() {
        this.searchEngines = this.$attrs.searchEngines || [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }];
        this.selectedEngine = this.searchEngines && this.searchEngines[0] ? this.searchEngines[0] : { name: "Google", url: "https://www.google.com/search?q=%keyword%" };
        this.selectedEngine.id = this.selectedEngine.id | 0;
    },
    methods: {
        doSearch() {
            if (!this.selectedEngine || !this.selectedEngine.url) showSnackBar("Err: No search engine selected.")
            let url = formatExternalURL(this.selectedEngine.url);
            if (!url.includes("%keyword%")) url += "%keyword%";
            location.href = url.replace("%keyword%", this.keyword);
        },
    },
    watch: {
        "$attrs.searchEngines": {
            handler(newVal) {
                this.searchEngines = this.$attrs.searchEngines || [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }];
                this.selectedEngine = this.searchEngines && this.searchEngines[0] ? this.searchEngines[0] : { name: "Google", url: "https://www.google.com/search?q=%keyword%" };
                this.selectedEngine.id = this.selectedEngine.id | 0;
            },
        },
    },
};
</script>

<template>
    <div class="search">
        <!-- <mdui-select value="item-1" label="Search engine">
            <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
            <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
        </mdui-select> -->
        <mdui-text-field type="search" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
            :label="`Search ${selectedEngine.name}`" clearable @input="keyword = $event.target.value"
            @keyup.enter="doSearch" helper="↑ Choose search engine here" helper-on-focus :autofocus="$attrs.autofocus">
            <mdui-dropdown slot="icon">
                <mdui-button-icon slot="trigger" icon="search" variant="filled"></mdui-button-icon>
                <mdui-menu>
                    <mdui-menu-item v-for="searchEngine in searchEngines"
                        @click="selectedEngine = searchEngine; selectedEngine.id = searchEngines.indexOf(searchEngine)"
                        :selected="selectedEngine.id == searchEngines.indexOf(searchEngine)">{{ searchEngine.name
                        }}</mdui-menu-item>
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