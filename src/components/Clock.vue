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
    <div class="timeContainer">
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

.currentTimeContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

#currentTime {
    /* height: 20vw; */
    /* margin-top: -1vw; */
    /* width: 100%; */
    font-size: 12.5vw;
    /* line-height: 12.5vw; */
    font-weight: bold;
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
    font-size: 1vw;
}

mdui-linear-progress {
    /* margin-left: 2rem; */
    /* margin-right: 2rem; */
    /* width: calc(100% - 4rem); */
    margin-top: -2.5vw;
    width: 100%;
}

/* #currentTime {
    width: 100%;
    height: 100%;
} */
</style>