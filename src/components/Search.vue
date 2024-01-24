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
            focused: false,
            resultclicked: false,
            bangs: {},
        };
    },
    mounted() {
        this.searchEngines = this.$attrs.searchEngines || [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }];
        this.selectedEngine = this.searchEngines && this.searchEngines[0] ? this.searchEngines[0] : { name: "Google", url: "https://www.google.com/search?q=%keyword%" };
        this.selectedEngine.id = this.selectedEngine.id || 0;
        this.keyword = "";
    },
    methods: {
        doSearch() {
            if (!this.keyword) return;

            // bang
            const parsedBang = this.keyword.split(" ", 1)[0];
            this.bang(parsedBang);

            const a = document.createElement("a");
            a.target = "_top";
            a.href = this.isInputURL ? formatExternalURL(this.keyword) : this.getSearchURL();
            a.click();
        },
        getSearchURL() {
            if (!this.selectedEngine || !this.selectedEngine.url) showSnackBar("Err: No search engine selected.");
            let url = formatExternalURL(this.selectedEngine.url);
            if (!url.includes("%keyword%")) url += "%keyword%";
            return url.replace("%keyword%", this.keyword);
        },
        switchengine() {
            if (!this.bang(this.keyword))
                this.selectedEngine = this.searchEngines[this.selectedEngine.id + 1] || this.searchEngines[0];
        },
        bang(bang) {
            const se = this.bangs[(bang.startsWith("!") ? bang.slice(1) : bang).toLowerCase()];
            if (se) {
                this.selectedEngine = se;
                this.keyword = this.keyword.slice(bang.length + 1);
                return true;
            }
            return false;
        },
    },
    computed: {
        results() {
            const result = [];

            const parsedBang = this.keyword.split(" ", 1)[0];
            if (this.keyword.startsWith("!")) {
                const bangTxt = parsedBang.slice(1);
                const se = this.bangs[bangTxt.toLowerCase()];
                if (se) {
                    result.push({
                        icon: 'lightbulb',
                        text: `Bang: ${se.name}`,
                    });
                } else {
                    if (bangTxt.length)
                        for (const bang in this.bangs) {
                            if (bang.startsWith(bangTxt))
                                result.push({
                                    icon: 'lightbulb',
                                    text: `Bang Suggest: ${bang}`,
                                    keyword: this.bangs[bang].name,
                                });
                        }
                    else
                        result.push({
                            icon: 'lightbulb',
                            text: `Bang`,
                            keyword: "",
                        });
                }
            }

            const search = {
                icon: 'search',
                text: `${this.selectedEngine.name} Search`,
                url: this.getSearchURL(),
            };
            const open = {
                icon: 'link',
                text: `Open URL`,
                url: formatExternalURL(this.keyword),
            };
            result.push(...(this.isInputURL ? [open, search] : [search, open]));

            return result;
        },
        isInputURL() {
            return this.keyword.startsWith("//") || this.keyword.startsWith("http") || this.keyword.endsWith("/");
        },
    },
    watch: {
        "$attrs.searchEngines": {
            handler(newVal) {
                this.searchEngines = this.$attrs.searchEngines || [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }];
                this.selectedEngine = this.searchEngines && this.searchEngines[0] ? this.searchEngines[0] : { name: "Google", url: "https://www.google.com/search?q=%keyword%" };
                this.selectedEngine.id = this.selectedEngine.id || 0;
                this.bangs = {};
                for (const engine of this.searchEngines) if (engine.bang) this.bangs[engine.bang.toLowerCase()] = engine;
            },
        },
        selectedEngine: {
            handler() {
                this.selectedEngine.id = this.selectedEngine.id || this.searchEngines.indexOf(this.selectedEngine);
            },
        },
    },
};
</script>

<template>
    <div class="search">
        <mdui-text-field type="search" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
            :label="`Search ${selectedEngine.name} or type a URL`" clearable @keydown.tab="$event.preventDefault()"
            @input="keyword = $event.target.value; focused = true;" @keyup.enter="doSearch" @keyup.tab="switchengine"
            helper="↑ Choose search engine here" helper-on-focus :autofocus="$attrs.autofocus" :value="keyword">
            <mdui-dropdown slot="icon">
                <mdui-button-icon slot="trigger" icon="search" variant="filled"></mdui-button-icon>
                <mdui-menu>
                    <mdui-menu-item v-for="searchEngine in searchEngines"
                        @click="selectedEngine = searchEngine; selectedEngine.id = searchEngines.indexOf(searchEngine)"
                        :selected="selectedEngine.id == searchEngines.indexOf(searchEngine)">{{ searchEngine.name
                        }} {{ searchEngine.bang ? `<${searchEngine.bang.toLowerCase()}>` : '' }}</mdui-menu-item>
                </mdui-menu>
            </mdui-dropdown>
            <mdui-button-icon slot="end-icon" icon="arrow_forward" @click="doSearch"></mdui-button-icon>
        </mdui-text-field>
        <mdui-menu v-if="(true || focused || resultclicked) && keyword" submenu-open-delay="200" submenu-close-delay="200"
            @focus="resultclicked = true">
            <mdui-menu-item v-for="result in results" :icon="result.icon" target="_top" :href="result.url">{{ result.text }}
                - {{ result.keyword || keyword
                }}</mdui-menu-item>
        </mdui-menu>
    </div>
</template>

<style scoped>
.search {
    /* display: flex; */
    width: 100%;
    align-items: center;
    position: relative;
}

.search>mdui-menu {
    position: absolute;
    width: 100%;
    max-width: unset !important;
    z-index: 114;
    background-color: rgb(var(--mdui-color-surface-container-highest));
    /* border-color: rgb(var(--mdui-color-on-primary)); */
    /* border: 2px solid rgb(var(--mdui-color-on-primary)); */
    border-radius: 0 0 1rem 1rem;
    border-width: 1px;
    box-shadow: 0px 5px 1rem rgba(0, 0, 0, 0.3);
    /* overflow: hidden; */
    padding-top: 0;
    padding-bottom: 1rem;
    margin-top: -1.5rem;
}
</style>