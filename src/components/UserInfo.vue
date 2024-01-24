<template>
    <mdui-dropdown>
        <mdui-button-icon class="userInfoBtn" slot="trigger">
            <mdui-avatar v-if="$attrs.config.avatar" :src="$attrs.config.avatar"></mdui-avatar>
            <mdui-icon v-else name='account_circle'></mdui-icon>
        </mdui-button-icon>
        <mdui-menu>
            <mdui-menu-item style="display: flex; width: 100%; align-items: center; justify-content: center;">Hi, {{
                $attrs.config.userName || "Guest" }}</mdui-menu-item>
            <mdui-menu-item @click="$attrs.toggleUserConfig('useJBM')"><mdui-checkbox :checked="$attrs.userConfig.useJBM" @input="$attrs.toggleUserConfig('useJBM')">Use JetBrains Mono</mdui-checkbox></mdui-menu-item>
            <mdui-menu-item @click="$attrs.toggleUserConfig('showClock')"><mdui-checkbox :checked="$attrs.userConfig.showClock" @input="$attrs.toggleUserConfig('showClock')">Show Clock</mdui-checkbox></mdui-menu-item>
            <mdui-menu-item @click="$attrs.toggleUserConfig('showLunarDate')"><mdui-checkbox :checked="$attrs.userConfig.showLunarDate" @input="$attrs.toggleUserConfig('showLunarDate')">Show Lunar Date</mdui-checkbox></mdui-menu-item>
            <mdui-menu-item @click="$attrs.toggleUserConfig('autoFocusSearchBar')"><mdui-checkbox :checked="$attrs.userConfig.autoFocusSearchBar" @input="$attrs.toggleUserConfig('autoFocusSearchBar')">Search Bar Auto Focus</mdui-checkbox></mdui-menu-item>
            <mdui-menu-item @click="$attrs.openSetConfigDialog()">Settings</mdui-menu-item>
        </mdui-menu>
    </mdui-dropdown>
</template>

<style scoped>
mdui-button-icon.userInfoBtn>mdui-avatar {
    transform: scale(0.8);
}

mdui-button-icon.userInfoBtn>mdui-icon {
    transform: scale(1.5);
}
</style>