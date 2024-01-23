<script>
export default {
    data() {
        return {
            configType: 'local',
            configURL: '',
            configTxt: '',
        }
    },
    methods: {
        confirm() {
            if (this.configType === 'local') {
                localStorage.removeItem("configURL");
                localStorage.setItem("config", this.configTxt);
                this.$attrs.reloadConfig(JSON.parse(this.configTxt));
            } else {
                localStorage.setItem("configURL", this.configURL);
                this.$attrs.loadConfigOnline(this.configURL);
            }
            this.$attrs.closeDialog();
        },
    },
    watch: {
        "$attrs.open": {
            handler(newVal) {
                if (newVal) {
                    this.configURL = localStorage.getItem("configURL");
                    const configTxt = localStorage.getItem("config");
                    try {
                        this.configTxt = JSON.stringify(JSON.parse(configTxt), null, 2);
                    } catch (error) {
                        this.configTxt = configTxt;
                    }

                    this.configType = this.configURL ? 'remote' : 'local';
                }
            },
        },
    },
}
</script>

<template>
    <mdui-dialog close-on-overlay-click headline="Configuration" :open="$attrs.open">
        <mdui-tabs :value="configType" full-width variant="secondary">
            <mdui-tab value="remote" @click="configType = $event.target.value">Online</mdui-tab>
            <mdui-tab value="local" @click="configType = $event.target.value">Local</mdui-tab>

            <mdui-tab-panel slot="panel" value="remote">
                <mdui-text-field label="Remote Configuration URL" type="url" :value="configURL"
                    @input="configURL = $event.target.value"></mdui-text-field>
            </mdui-tab-panel>
            <mdui-tab-panel slot="panel" value="local">
                <mdui-text-field autosize min-rows="5" max-rows="10" label="Configuration JSON content" autocapitalize="off"
                    autocomplete="off" autocorrect="off" spellcheck="false" :value="configTxt"
                    @input="configTxt = $event.target.value"></mdui-text-field>
            </mdui-tab-panel>
        </mdui-tabs>

        <mdui-button slot="action" variant="text" @click="$attrs.closeDialog()">Cancel</mdui-button>
        <mdui-button slot="action" variant="filled" @click="confirm">Confirm</mdui-button>
    </mdui-dialog>
</template>

<style scoped>
mdui-tabs {
    min-width: 50vw;
}

mdui-tab {
    background-color: rgb(var(--mdui-color-surface-container-high));
}

mdui-tab-panel {
    margin-top: 5px;
}
</style>