<script setup>
// import { onMounted } from 'vue';
import { getForecast } from '../utils/weatherapi.com';
import { showSnackBar } from '../utils/snackBar';
</script>

<script>
export default {
    data() {
        return {
            city: null,
            days: 3,
            apiKey: null,
            weather: null,
            interval: 60,
            intervalID: null,
        };
    },
    mounted() {
        // this.update();
        window.document.addEventListener('visibilitychange', this.update);
    },
    methods: {
        async update() {
            if (!this.city || !this.apiKey) {
                this.clearInterval();
                return showSnackBar("Weather load: City or api key not set.");
            }
            if (document.visibilityState === "hidden") return this.clearInterval();
            this.weather = await getForecast(this.apiKey, this.city, this.days).catch(err => {
                showSnackBar("Weather load: ERROR");
                return this.weather;
            });
            if (!this.intervalID && this.weather) this.setInterval();
        },
        showToolTip() {
            showSnackBar(`${this.weather ? "Change" : "Set"} City and API Key in your config file`, "top-end");
        },
        setInterval() {
            if (this.intervalID) window.clearInterval(this.intervalID);
            this.intervalID = window.setInterval(this.update, this.interval * 1000);
        },
        clearInterval() {
            if (this.intervalID) {
                window.clearInterval(this.intervalID);
                this.intervalID = null;
            }
        },
    },
    watch: {
        "$attrs.config": {
            handler(newVal) {
                this.city = newVal.city;
                this.days = newVal.days || 3;
                this.apiKey = newVal.key;
                this.interval = typeof newVal.interval === 'number' ? newVal.interval || 60 : 60;
                this.update();
            },
        },
    }
};
</script>

<template>
    <div class="weatherContainer">
        <mdui-dropdown v-if="weather">
            <mdui-button slot="trigger">
                <span class="btnTxt">
                    {{ weather.current.condition.text }}
                    <br />
                    {{ weather.current.temp[0] }}°C
                </span>
                <img slot="icon" :src="weather.current.condition.icon" class="btnImg" />
            </mdui-button>
            <mdui-menu>
                <mdui-list-item @click="showToolTip">
                    {{ city }}
                    <span slot="description">
                        Last Updated: {{ weather.lastUpdated }}
                    </span>
                </mdui-list-item>

                <mdui-list-item class="devider"></mdui-list-item>

                <mdui-list-item rounded>
                    {{ weather.current.temp[0] }}°C
                    <span slot="description">
                        Feels Like: {{ weather.current.feelsLike[0] }}°C
                    </span>
                </mdui-list-item>
                <mdui-list-item rounded>
                    {{ weather.forecasts[0].moon.phase }}
                    <span slot="description">
                        Moon Phase
                        <br />
                        Illumination: {{ weather.forecasts[0].moon.illumination }}%
                    </span>
                </mdui-list-item>

                <mdui-list-item class="devider"></mdui-list-item>

                <mdui-list-item rounded v-for="forecast in weather.forecasts">
                    {{ forecast.date }}
                    <span slot="description">
                        {{ forecast.temp.min[0] }}-{{ forecast.temp.max[0] }}°C <span class="avgTxt">{{ forecast.temp.avg[0]
                        }}°C</span>
                        <br />
                        {{ forecast.condition.text }}
                    </span>
                    <mdui-avatar slot="icon" :src="forecast.condition.icon"></mdui-avatar>
                </mdui-list-item>
            </mdui-menu>
        </mdui-dropdown>

        <mdui-button icon="cloud_off" @click="showToolTip" v-else>
            <span class="btnTxt">
                Weather
                <br />
                Unavaliable
            </span>
        </mdui-button>
    </div>
</template>

<style scoped>
.weatherContainer {
    height: 2.5rem;
    display: flex;
}

.btnImg {
    height: 3rem;
    /* transform: scale(0.75); */
    /* margin-top: 0.5rem; */
    align-self: center;
}

mdui-menu {
    max-width: unset !important;
    width: 100%;
    max-height: calc(100vh - 3.25rem);
    overflow-y: scroll;
}

.btnTxt {
    text-align: start;
}

mdui-avatar {
    background-color: unset !important;
}

.devider {
    height: 1rem;
}

.avgTxt {
    text-decoration: overline;
}
</style>