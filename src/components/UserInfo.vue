<template>
    <mdui-dropdown>
        <mdui-button-icon class="userInfoBtn" slot="trigger">
            <mdui-avatar v-if="$attrs.config.avatar" :src="$attrs.config.avatar"></mdui-avatar>
            <mdui-icon v-else name='account_circle'></mdui-icon>
        </mdui-button-icon>
        <mdui-menu>
            <mdui-menu-item style="display: flex; width: 100%; align-items: center; justify-content: center;">Hi, {{
                $attrs.config.userName || "Guest" }}</mdui-menu-item>
            <mdui-menu-item @click="$attrs.changeFont()"><mdui-checkbox :checked="$attrs.useJBM" @input="$attrs.changeFont()">Use JetBrains Mono</mdui-checkbox></mdui-menu-item>
            <mdui-menu-item @click="$attrs.toggleClock()"><mdui-checkbox :checked="$attrs.showClock" @input="$attrs.toggleClock()">Show Clock</mdui-checkbox></mdui-menu-item>
            <mdui-menu-item @click="$attrs.toggleAutoFocusSearchBar()"><mdui-checkbox :checked="$attrs.autoFocusSearchBar" @input="$attrs.toggleAutoFocusSearchBar()">Search Bar Auto Focus</mdui-checkbox></mdui-menu-item>
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