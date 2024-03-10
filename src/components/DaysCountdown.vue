<script setup>
import lunarFun from 'lunar-fun';
</script>

<script>
export default {
    data() {
        return {
        };
    },
    async mounted() {
        this.update();
    },
    methods: {
        getRemaining(event) {
            // tks ChatGPT
            // Convert both dates to milliseconds
            const date1_ms = new Date();
            const date2_ms = new Date(event.date[0], event.date[1] - 1, event.date[2]);
            // Calculate the difference in milliseconds
            const difference_ms = Math.abs(date1_ms - date2_ms);
            // Convert the difference to days, hours, minutes, and seconds
            const days = Math.floor(difference_ms / (1000 * 60 * 60 * 24)).toString();
            const hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24).toString();
            const minutes = Math.floor((difference_ms / (1000 * 60)) % 60).toString();
            const seconds = Math.floor((difference_ms / 1000) % 60).toString();

            return event.seconds ? `${days} day${days > 1 ? "s" : ''} ${["0", ""][hours.length-1]}${hours}:${["0", ""][hours.length-1]}${minutes}:${["0", ""][seconds.length-1]}${seconds}` : `${days} day${days > 1 ? "s" : ''}`;
        },
        async update() {
            if (this.$attrs.events) for (const i of this.$attrs.events) i.remaining = this.getRemaining(i);
            // 请求下一帧执行 updateTime 方法
            requestAnimationFrame(this.update);
        },
    },
};
</script>

<template>
    <mdui-card variant="outlined" v-for="event in $attrs.events">
        <div>
            <span class="title">
                {{ event.name }}
            </span>
            <br />
            <span class="dueto">
                {{ event.date.join("/") }}
            </span>
        </div>
        <span class="countdown">
            {{ event.remaining }}
        </span>
    </mdui-card>
</template>

<style scoped>
mdui-card {
    width: 100%;
    min-height: 50px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
}
span.title {
    font-size: x-large;
}
span.countdown {
    font-size: xx-large;
    margin-right: 0px;
}
</style>