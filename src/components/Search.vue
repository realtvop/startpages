<script setup>
import { showSnackBar } from '../utils/snackBar';
import { formatExternalURL } from '../utils/formatURL';
import { TLD } from '../utils/topLevelDomains';
</script>

<script>
// http://data.iana.org/TLD/tlds-alpha-by-domain.txt
export default {
    data() {
        return {
            searchEngines: [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }],
            selectedEngine: { name: "Google", url: "https://www.google.com/search?q=%keyword%" },
            keyword: "",
            focused: false,
            resultclicked: false,
            bangs: {},
            primaryBang: '',
            forceFocus: false,
        };
    },
    async mounted() {
        this.searchEngines = this.$attrs.searchEngines || [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }];
        this.selectedEngine = this.searchEngines && this.searchEngines[0] ? this.searchEngines[0] : { name: "Google", url: "https://www.google.com/search?q=%keyword%" };
        this.selectedEngine.id = this.selectedEngine.id || 0;
        this.bangs = {};
        for (const engine of this.searchEngines) if (engine.bang) for (const bang of engine.bang) this.bangs[bang.toLowerCase()] = engine;
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
            if (!this.bang(this.keyword, this.primaryBang))
                this.selectedEngine = this.searchEngines[this.selectedEngine.id + 1] || this.searchEngines[0];
        },
        bang(bang, primary) {
            const se = this.bangs[((bang.startsWith("!") || this.keyword.startsWith("！")) ? bang.slice(1) : bang).toLowerCase()];
            if (se || primary) {
                this.selectedEngine = se || this.bangs[primary];
                this.keyword = this.keyword.slice(bang.length + 1);
                return true;
            }
            return false;
        },
        focus(then) {
            window.document.querySelector('.searchInput').focus();
            return then();
        },
    },
    computed: {
        results() {
            const result = [];

            const parsedBang = this.keyword.split(" ", 1)[0];
            let primaryBang = '';
            if (this.keyword.startsWith("!") || this.keyword.startsWith("！")) {
                const bangTxt = parsedBang.slice(1);
                const se = this.bangs[bangTxt.toLowerCase()];
                const restKeyword = this.keyword.slice(parsedBang.length + 1);
                if (se && restKeyword) {
                    result.push({
                        icon: 'lightbulb',
                        text: `Bang: ${se.name}`,
                        keyword: restKeyword,
                    });
                } else {
                    if (bangTxt.length) {
                        for (const bang in this.bangs) {
                            if (bang.startsWith(bangTxt)) {
                                primaryBang = primaryBang || bang;
                                result.push({
                                    icon: 'lightbulb',
                                    text: `Bang Suggest: ${bang}`,
                                    keyword: this.bangs[bang].name,
                                    onclick: () => {
                                        window.document.querySelector('.searchInput').focus();
                                        this.selectedEngine = this.bangs[bang];
                                        this.keyword = '';
                                    },
                                });
                            }
                        }
                    } else
                        result.push({
                            icon: 'lightbulb',
                            text: `Bang`,
                            keyword: "",
                        });
                }
            }
            this.primaryBang = primaryBang;

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
            if (this.keyword.startsWith("//") || this.keyword.startsWith("http") || this.keyword.endsWith("/")) return true;
            const parsed = this.keyword.split(".");
            if (!parsed.length || parsed.length === 1) return false;
            const last = parsed[parsed.length - 1];
            if (["html", "php", "aspx"].includes(last)) return true;
            if (TLD.includes(last.toUpperCase())) return true;
            return false;
        },
    },
    watch: {
        "$attrs.searchEngines": {
            async handler(newVal) {
                this.searchEngines = this.$attrs.searchEngines || [{ name: "Google", url: "https://www.google.com/search?q=%keyword%" }];
                this.selectedEngine = this.searchEngines && this.searchEngines[0] ? this.searchEngines[0] : { name: "Google", url: "https://www.google.com/search?q=%keyword%" };
                this.selectedEngine.id = this.selectedEngine.id || 0;
                this.bangs = {};
                for (const engine of this.searchEngines) if (engine.bang) for (const bang of engine.bang) this.bangs[bang.toLowerCase()] = engine;
            },
        },
        selectedEngine: {
            async handler() {
                this.selectedEngine.id = this.selectedEngine.id || this.searchEngines.indexOf(this.selectedEngine);
            },
        },
    },
};
</script>

<template>
    <div class="search">
        <mdui-text-field class="searchInput" type="search" autocapitalize="off" autocomplete="off" autocorrect="off"
            spellcheck="false" :label="`Search ${selectedEngine.name} or type a URL`" clearable
            @keydown.tab="$event.preventDefault()" @input="keyword = $event.target.value; focused = true;"
            @keyup.enter="doSearch" @keyup.tab="switchengine" helper="↑ Choose search engine here" helper-on-focus
            :autofocus="$attrs.autofocus" :value="keyword">
            <mdui-dropdown slot="icon">
                <mdui-button-icon slot="trigger" icon="search" variant="filled"></mdui-button-icon>
                <mdui-menu>
                    <mdui-menu-item v-for="searchEngine in searchEngines"
                        @click="selectedEngine = searchEngine; selectedEngine.id = searchEngines.indexOf(searchEngine)"
                        :selected="selectedEngine.id == searchEngines.indexOf(searchEngine)">{{ searchEngine.name
                        }} {{ searchEngine.bang ? `<${searchEngine.bang.join(" | ").toLowerCase()}>` : '' }}</mdui-menu-item>
                    </mdui-menu>
                </mdui-dropdown>
                <mdui-button-icon slot="end-icon" icon="arrow_forward" @click="doSearch"></mdui-button-icon>
        </mdui-text-field>
        <mdui-menu v-if="(true || focused || resultclicked) && keyword" submenu-open-delay="200" submenu-close-delay="200"
            @focus="resultclicked = true">
            <mdui-menu-item v-for="result in results" :icon="result.icon" target="_top" :href="result.url"
                @click="result.onclick">{{ result.text }}
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

mdui-menu {
    max-width: calc(100vw - 4rem) !important;
}

.search>mdui-menu {
    position: absolute;
    width: 100%;
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
}</style>