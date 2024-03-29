<script setup>
import Main from './components/Main.vue';
import SetConfigDialog from './components/SetConfigDialog.vue';
import UserInfo from './components/UserInfo.vue';
import Weather from './components/Weather.vue';

import defaultConfig from './utils/defaultConfig.json';
import { showSnackBar } from './utils/snackBar';
</script>

<script>
export default {
    data() {
        return {
            config: {},
            setConfigDialog: {
                open: false,
            },
            userConfig: {
                useJBM: false,
                showClock: false,
                autoFocusSearchBar: true,
                showLunarDate: false,
            },
            online: navigator.onLine,
        };
    },
    async mounted() {
        const configURL = localStorage.getItem("configURL");
        const configTxt = localStorage.getItem("config");
        if (!configTxt) {
            if (!configURL) localStorage.setItem("configURL", "/demo.json");
            this.loadConfigOnline(configURL || "/demo.json");
        } else {
            try {
                this.config = JSON.parse(configTxt);
            } catch (err) {
                console.log(err);
                showSnackBar("Config loading: ERROR");
                this.config = defaultConfig;
            }
            if (configURL && this.online) this.loadConfigOnline(configURL, true);
        }
        const userConfig = localStorage.getItem("userConfig");
        if (userConfig)
            try {
                const userConfigParsed = JSON.parse(userConfig);
                for (const i in userConfigParsed) this.userConfig[i] = userConfigParsed[i];
            } catch (err) {
                console.log(err);
                showSnackBar("User config loading: ERROR");
            }
    },
    methods: {
        async loadConfigOnline(url, dontLoadDefault) {
            fetch(url)
                // .then(r => r.json())
                .then(r => r.text())
                .then(t => JSON.parse(t))
                .then(j => this.config = j)
                .then(() => showSnackBar("Config updated successfully"))
                .catch(err => {
                    console.log(err);
                    showSnackBar("Config online loading: ERROR");
                    if (!dontLoadDefault) this.config = defaultConfig;
                });
        },
        // setFont(useJBM) {
        //     this.userConfig.useJBM = useJBM;
        //     console.log(useJBM, this.userConfig.useJBM)
        //     // document.body.style.fontFamily = this.userConfig.useJBM ? 'JetBrainsMono' : 'Roboto, Noto, Helvetica, Arial, sans-serif';
        //     // document.body.style.fontSize = this.userConfig.useJBM ? 'unset' : '14px';
        // },
    },
    watch: {
        config: {
            async handler(newVal) {
                // globalConfig = this.config = newVal;
                localStorage.setItem("config", JSON.stringify(newVal));
                window.mdui.setColorScheme(newVal.color || "#64c8ff");
            },
        },
        userConfig: {
            async handler(newVal) {
                localStorage.setItem("userConfig", JSON.stringify(newVal));
                // this.loadFont();
                window.document.body.style.fontFamily = newVal.useJBM ? 'JetBrainsMono' : 'Roboto, Noto, Helvetica, Arial, sans-serif';
            },
            deep: true,
        },
    },
}
</script>

<template>
    <SetConfigDialog :open="setConfigDialog.open" :config="config" :loadConfigOnline="loadConfigOnline"
        :closeDialog="() => setConfigDialog.open = false" :reloadConfig="c => config = c"></SetConfigDialog>
    <mdui-layout style="position: fixed; left: 0; right: 0; top: 0; bottom: 0;">
        <mdui-top-app-bar order="1">
            <mdui-top-app-bar-title>
                {{ config.title || "realtvop's startpage" }}
            </mdui-top-app-bar-title>
            <div style="flex-grow: 1"></div>
            <mdui-button-icon icon="cloud_off" v-if="!online"></mdui-button-icon>
            <Weather v-else :config="config.weatherApi"></Weather>
            <UserInfo :config="config" :userConfig="userConfig"
                :openSetConfigDialog="function () { setConfigDialog.open = true }"
                :toggleUserConfig="function (key) { userConfig[key] = !userConfig[key] }"></UserInfo>
        </mdui-top-app-bar>

        <mdui-layout-main>
            <Main :config="config" :userConfig="userConfig"></Main>
        </mdui-layout-main>
    </mdui-layout>
</template>

<style scoped>
mdui-layout>mdui-top-app-bar {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}
</style>
