<script setup>
import lunarFun from 'lunar-fun';
</script>

<script>
export default {
    data() {
        return {
            currentTime: '',
            dayProgress: 0,
            currentDate: '',
            usrTimeZone: '',
            currentYear: '',
            cnLunarDate: '',
        };
    },
    mounted() {
        this.updateTime();
    },
    methods: {
        updateTime() {
            const now = new Date();
            const nowTexts = now.toString().split(" ");
            if (!this.usrTimeZone) this.usrTimeZone = now.toString().split("(")[1].slice(0, -1);

            const nowTime = [now.getHours(), now.getMinutes(), now.getSeconds()];
            const hours = String(nowTime[0]).padStart(2, '0');
            const minutes = String(nowTime[1]).padStart(2, '0');
            const seconds = String(nowTime[2]).padStart(2, '0');

            this.currentTime = `${hours}:${minutes}:${seconds}`;
            const currentDate = `${nowTexts[0]} ${nowTexts[1]} ${nowTexts[2]}`;
            if (currentDate != this.currentDate || !this.cnLunarDate) this.cnLunarDate = getLunarDate(now);
            this.currentDate = currentDate;
            this.currentYear = nowTexts[3];
            this.dayProgress = (nowTime[0] * 3600 + nowTime[1] * 60 + nowTime[2]) / 86400;

            // 请求下一帧执行 updateTime 方法
            requestAnimationFrame(this.updateTime);

            function getLunarDate(now) {
                const cnDate = new Intl.DateTimeFormat('zh-TW', { timeZone: "Asia/Taipei" }).format(now).split("/");
                const lunarDateData = lunarFun.gregorianToLunal(...cnDate);
                const date = lunarFun.formatLunarDate(...lunarDateData).slice(5);
                const heavenlyStem = lunarFun.getHeavenlyStems(lunarDateData[0]);
                const earthlyBranches = lunarFun.getEarthlyBranches(lunarDateData[0]);

                return `${heavenlyStem}${earthlyBranches}年${date}`;
            }
        },
    }
};
</script>

<template>
    <div class="fullscreenClock" v-if="$attrs.fullscreen">
        <span id="currentTime">{{ currentTime }}</span>
        <mdui-linear-progress :value="dayProgress"></mdui-linear-progress>
        <div class="currentTimeContainer">
            <div class="info" style="height: unset;">
                <span class="info-small info-left">{{ usrTimeZone }}</span>
                <span class="info-small info-left">{{ cnLunarDate }} {{ currentYear }}</span>
            </div>
            <span class="info-large">{{ currentDate }}</span>
        </div>
    </div>
    <div class="timeContainer" v-else>
        <div class="currentTimeContainer">
            <span id="currentTime">{{ currentTime }}</span>
            <div class="info">
                <span class="info-small">{{ usrTimeZone }}</span>
                <span class="info-large">{{ currentDate }}</span>
                <span class="info-small">{{ cnLunarDate }} {{ currentYear }}</span>
            </div>
        </div>
        <mdui-linear-progress :value="dayProgress"></mdui-linear-progress>
    </div>
</template>

<style scoped>
.timeContainer {
    font-family: 'JetBrainsMono';
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 15vw;
    margin-top: -3vw;
}

.fullscreenClock {
    font-family: 'JetBrainsMono';
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (orientation: portrait) {
        transform: rotate(90deg);
        height: calc(100vh - 4rem);
        --length-unit: calc((100vh - 4rem) / 100);
        /* width: calc(475 * var(--length-unit) / 5.5); */
        /* width: calc(100vw - 4rem); */
        margin-top: -1vh;
        /* width: calc(100% - (50 * var(--length-unit) / 5.5)); */
        /* overflow-y: hidden; */
        /* width: 100vw; */
        /* height: 100vh; */
    }
    @media (orientation: landscape) {
        --length-unit: 1vw;
        width: 100%;
        height: calc(100% + 2rem);
        margin-top: -2.5rem;
    }
}

.currentTimeContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media (orientation: portrait) {
        width: calc(500 * var(--length-unit) / 5.5) !important;
    }
}

#currentTime {
    /* height: 20vw; */
    /* margin-top: -1vw; */
    /* width: 100%; */
    font-size: 12.5vw;
    /* line-height: 12.5vw; */
    font-weight: bold;
}

.fullscreenClock>#currentTime {
    /* @media (orientation: portrait) {
        font-size: calc(100vh / 5.5) !important;
    }
    @media (orientation: landscape) {
        font-size: calc(100vw / 5.5) !important;
    } */
    font-size: calc(100 * var(--length-unit) / 5.5) !important;
}

.info {
    display: flex;
    /* width: 100%; */
    height: 100%;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
}

.info-large {
    align-self: flex-end;
    /* margin-right: 2rem; */
    line-height: normal;
    font-size: 4vw;
}

.info-small {
    align-self: flex-end;
    /* margin-left: 2rem; */
    line-height: normal;
    font-size: 1.25vw;
}

.info-left {
    align-self: flex-start !important;
    font-size: calc(1.25 * var(--length-unit));
}
.currentTimeContainer.info-large {
    font-size: calc(4 * var(--length-unit));
}

mdui-linear-progress {
    /* margin-left: 2rem; */
    /* margin-right: 2rem; */
    /* width: calc(100% - 4rem); */
    margin-top: -2.5vw;
    width: 100%;
}
.fullscreenClock>mdui-linear-progress {
    margin-top: calc(-2.5 * var(--length-unit));
    @media (orientation: portrait) {
        width: calc(500 * var(--length-unit) / 5.5);
    }
}

/* #currentTime {
    width: 100%;
    height: 100%;
} */
</style>