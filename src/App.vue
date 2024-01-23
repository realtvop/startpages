<script setup>
import Main from './components/Main.vue';
import SetConfigDialog from './components/SetConfigDialog.vue';
import UserInfo from './components/UserInfo.vue';
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
        };
    },
    mounted() {
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
            if (configURL && navigator.onLine) this.loadConfigOnline(configURL);
        }
    },
    methods: {
        loadConfigOnline(url) {
            fetch(url)
                // .then(r => r.json())
                .then(r => r.text())
                .then(t => JSON.parse(t))
                .then(j => this.config = j)
                .then(() => showSnackBar("Config updated successfully"))
                .catch(err => {
                    console.log(err);
                    showSnackBar("Config online loading: ERROR");
                    this.config = defaultConfig;
                });
        }
    },
    watch: {
        config: {
            handler(newVal) {
                // globalConfig = this.config = newVal;
                localStorage.setItem("config", JSON.stringify(newVal));
                window.mdui.setColorScheme(newVal.color || "#64c8ff");
            },
        },
    },
}
</script>

<template>
    <SetConfigDialog :open="setConfigDialog.open" :config="config" :loadConfigOnline="loadConfigOnline" :closeDialog="() => setConfigDialog.open = false" :reloadConfig="c => config = c"></SetConfigDialog>
    <mdui-layout style="position: fixed; left: 0; right: 0; top: 0; bottom: 0;">
        <mdui-top-app-bar order="1" scroll-behavior="elevate">
            <mdui-top-app-bar-title>
                {{ config.title || "realtvop's startpage" }}
            </mdui-top-app-bar-title>
            <div style="flex-grow: 1"></div>
            <UserInfo :config="config" :openSetConfigDialog="() => setConfigDialog.open = true"></UserInfo>
        </mdui-top-app-bar>

        <mdui-layout-main>
            <Main :config="config"></Main>
        </mdui-layout-main>
    </mdui-layout>
</template>

<style scoped>
mdui-layout>mdui-top-app-bar {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}
</style>
