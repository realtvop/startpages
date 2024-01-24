<script setup>
import { formatExternalURL } from '../utils/formatURL';

function getIcon(url) {
    url = formatExternalURL(url, "https:");
    const parsed = new window.URL(url);
    return `${parsed.origin}/favicon.ico`;
}

function openPopup(url) {
    window.open(url, "popupWindow", "width=600,height=400");
}
</script>

<template>
    <div v-for="column in $attrs.pages">
        <mdui-divider></mdui-divider>
        <div class="content">
            <h4>{{ column.title || "New Column" }}</h4>
            <mdui-list style="max-width: 100%;">
                <mdui-list-item v-for="link in column.links" @click="link.popup ? openPopup(link.url) : null" target="_top" :href="link.popup ? null : formatExternalURL(link.url)" rounded>
                    {{ link.name || link.url }}
                    <span slot="description" v-if="link.description">{{ link.description }}</span>
                    <mdui-avatar slot="icon" :src="link.icon || getIcon(link.url)"></mdui-avatar>
                </mdui-list-item>
            </mdui-list>
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.content>div {
    display: block;
}

.content>mdui-list {
    display: grid;
    /* grid-template-columns: repeat(calc(100vw / 350px), 1fr); */
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    overflow-x: scroll;
    gap: 0.1rem;
}

mdui-list-item {
    width: 20rem;
    max-width: calc(100vw - 4rem)
}
</style>