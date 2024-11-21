<template>
    <div class="d-flex gap-2 align-items-center justify-content-center">


        <v-icon color='#f1edd6' :class="isAnimating ? 'mdi mdi-pause-circle-outline' : 'mdi mdi-play-circle-outline'"
            size="35" @click="toggleAnimation"></v-icon>
        <v-icon color='#f1edd6' :disabled="!isAnimating" class="mdi mdi-stop-circle-outline" size="35"
            @click="stopAudio"></v-icon>
        <div class="loader">
            <svg id="wave" :class="isAnimating ? 'animate' : ''" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 38.05" width="200">
                <path id="Line_1" data-name="Line 1"
                    d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z" />
                <path id="Line_2" data-name="Line 2"
                    d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z" />
                <path id="Line_3" data-name="Line 3"
                    d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z" />
                <path id="Line_4" data-name="Line 4"
                    d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z" />
                <path id="Line_5" data-name="Line 5"
                    d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z" />
                <path id="Line_6" data-name="Line 6"
                    d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z" />
                <path id="Line_7" data-name="Line 7"
                    d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z" />
                <path id="Line_8" data-name="Line 8"
                    d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z" />
                <path id="Line_9" data-name="Line 9"
                    d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z" />
                <path id="Line_10" data-name="Line 10"
                    d="M54.91,15l-0.12,0A1,1,0,0,0,54,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H54.91Z" />
                <path id="Line_11" data-name="Line 11"
                    d="M60.91,10l-0.12,0A1,1,0,0,0,60,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H60.91Z" />
                <path id="Line_12" data-name="Line 12"
                    d="M66.91,0L66.78,0A1,1,0,0,0,66,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H66.91Z" />
                <path id="Line_13" data-name="Line 13"
                    d="M72.91,10l-0.12,0A1,1,0,0,0,72,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H72.91Z" />
                <path id="Line_14" data-name="Line 14"
                    d="M78.91,15l-0.12,0A1,1,0,0,0,78,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H78.91Z" />
                <path id="Line_15" data-name="Line 15"
                    d="M84.91,15l-0.12,0A1,1,0,0,0,84,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H84.91Z" />
                <path id="Line_16" data-name="Line 16"
                    d="M90.91,10l-0.12,0A1,1,0,0,0,90,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H90.91Z" />
                <path id="Line_17" data-name="Line 17"
                    d="M96.91,0L96.78,0A1,1,0,0,0,96,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H96.91Z" />
                <path id="Line_18" data-name="Line 18"
                    d="M102.91,9L102.78,9A1,1,0,0,0,102,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H102.91Z" />
                <path id="Line_19" data-name="Line 19"
                    d="M108.91,15l-0.12,0A1,1,0,0,0,108,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H108.91Z" />
                <path id="Line_20" data-name="Line 20"
                    d="M114.91,15l-0.12,0A1,1,0,0,0,114,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H114.91Z" />
                <path id="Line_21" data-name="Line 21"
                    d="M120.91,10l-0.12,0A1,1,0,0,0,120,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H120.91Z" />
                <path id="Line_22" data-name="Line 22"
                    d="M126.91,0L126.78,0A1,1,0,0,0,126,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H126.91Z" />
                <path id="Line_23" data-name="Line 23"
                    d="M132.91,10l-0.12,0A1,1,0,0,0,132,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H132.91Z" />
                <path id="Line_24" data-name="Line 24"
                    d="M138.91,15l-0.12,0A1,1,0,0,0,138,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H138.91Z" />
                <path id="Line_25" data-name="Line 25"
                    d="M144.91,15l-0.12,0A1,1,0,0,0,144,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H144.91Z" />
                <path id="Line_26" data-name="Line 26"
                    d="M150.91,10l-0.12,0A1,1,0,0,0,150,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H150.91Z" />
                <path id="Line_27" data-name="Line 27"
                    d="M156.91,0L156.78,0A1,1,0,0,0,156,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H156.91Z" />
                <path id="Line_28" data-name="Line 28"
                    d="M162.91,9L162.78,9A1,1,0,0,0,162,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H162.91Z" />
                <path id="Line_29" data-name="Line 29"
                    d="M168.91,15l-0.12,0A1,1,0,0,0,168,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H168.91Z" />
                <path id="Line_30" data-name="Line 30"
                    d="M174.91,15l-0.12,0A1,1,0,0,0,174,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H174.91Z" />
                <path id="Line_31" data-name="Line 31"
                    d="M180.91,10l-0.12,0A1,1,0,0,0,180,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H180.91Z" />
                <path id="Line_32" data-name="Line 32"
                    d="M186.91,0L186.78,0A1,1,0,0,0,186,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H186.91Z" />
                <path id="Line_33" data-name="Line 33"
                    d="M192.91,10l-0.12,0A1,1,0,0,0,192,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H192.91Z" />
            </svg>

        </div>
    </div>
</template>
<script>
export default {
    props: {
        audioSrc: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isAnimating: false, 
            audio: null,
        };
    },
    watch: {
        audioSrc(newSrc) {
            this.updateAudioSource(newSrc);
        },
    },
    mounted() {
        this.audio = new Audio(this.audioSrc);
        this.audio.addEventListener('ended', this.onAudioEnd);
        this.audio.addEventListener('pause', this.onAudioEnd);
    },
    beforeUnmount() {
        this.$store.commit('setIsVideoPlaying', false);
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('ended', this.onAudioEnd);
            this.audio.removeEventListener('pause', this.onAudioEnd);
            this.audio = null;
        }
    },
    methods: {
        onAudioEnd() {
            this.$store.commit('setIsVideoPlaying', false); 
        },
        toggleAnimation() {
            this.isAnimating = !this.isAnimating;
            if (this.isAnimating) {
                this.audio.play();
                this.$store.commit('setIsVideoPlaying', true);
            } else {
                this.audio.pause();
                this.$store.commit('setIsVideoPlaying', false);
            }
        },
        updateAudioSource(src) {
            if (this.audio) {
                this.audio.pause(); 
                this.audio.src = src; 
                this.audio.load(); 
            }
        },
        playAudio() {
            if (this.audio) {
                this.audio.play();
            }
        },
        stopAudio() {
            this.$store.commit('setIsVideoPlaying', false);
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0; 
                this.isAnimating = false;
            }
        },   
    },
   
};
</script>
<style scoped>

.loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

#wave {
    height: 40px;
    width: 200px;
    fill: #f1edd6;
}
.animate path{
    fill: #ffae00;
}
.animate #Line_1 {
    animation: pulse 1s infinite;
    animation-delay: 0.15s;
}

.animate #Line_2 {
    animation: pulse 1s infinite;
    animation-delay: 0.3s;
}

.animate #Line_3 {
    animation: pulse 1s infinite;
    animation-delay: 0.45s;
}

.animate #Line_4 {
    animation: pulse 1s infinite;
    animation-delay: 0.6s;
}

.animate #Line_5 {
    animation: pulse 1s infinite;
    animation-delay: 0.75s;
}

.animate #Line_6 {
    animation: pulse 1s infinite;
    animation-delay: 0.9s;
}

.animate #Line_7 {
    animation: pulse 1s infinite;
    animation-delay: 1.05s;
}

.animate #Line_8 {
    animation: pulse 1s infinite;
    animation-delay: 1.2s;
}

.animate #Line_9 {
    animation: pulse 1s infinite;
    animation-delay: 1.35s;
}

.animate #Line_10 {
    animation: pulse 1s infinite;
    animation-delay: 1.5s;
}

.animate #Line_11 {
    animation: pulse 1s infinite;
    animation-delay: 1.65s;
}

.animate #Line_12 {
    animation: pulse 1s infinite;
    animation-delay: 1.8s;
}

.animate #Line_13 {
    animation: pulse 1s infinite;
    animation-delay: 1.95s;
}

.animate #Line_14 {
    animation: pulse 1s infinite;
    animation-delay: 2.1s;
}

.animate #Line_15 {
    animation: pulse 1s infinite;
    animation-delay: 2.25s;
}

.animate #Line_16 {
    animation: pulse 1s infinite;
    animation-delay: 2.4s;
}

.animate #Line_17 {
    animation: pulse 1s infinite;
    animation-delay: 2.55s;
}

.animate #Line_18 {
    animation: pulse 1s infinite;
    animation-delay: 2.7s;
}

.animate #Line_19 {
    animation: pulse 1s infinite;
    animation-delay: 2.85s;
}

.animate #Line_20 {
    animation: pulse 1s infinite;
    animation-delay: 3s;
}

.animate #Line_21 {
    animation: pulse 1s infinite;
    animation-delay: 3.15s;
}
.animate #Line_22 {
    animation: pulse 1s infinite;
    animation-delay: 3.35s;
}
.animate #Line_23 {
    animation: pulse 1s infinite;
    animation-delay: 3.50s;
}
.animate #Line_24 {
    animation: pulse 1s infinite;
    animation-delay: 3.59s;
}
.animate #Line_25 {
    animation: pulse 1s infinite;
    animation-delay: 4.10s;
}
.animate #Line_26 {
    animation: pulse 1s infinite;
    animation-delay: 4.25s;
}
.animate #Line_27 {
    animation: pulse 1s infinite;
    animation-delay: 4.35s;
}
.animate #Line_28 {
    animation: pulse 1s infinite;
    animation-delay: 4.55s;
}
.animate #Line_29 {
    animation: pulse 1s infinite;
    animation-delay: 5.05s;
}
.animate #Line_30 {
    animation: pulse 1s infinite;
    animation-delay: 5.25s;
}
.animate #Line_31 {
    animation: pulse 1s infinite;
    animation-delay: 5.35s;
}
.animate #Line_32 {
    animation: pulse 1s infinite;
    animation-delay: 5.45s;
}
.animate #Line_33 {
    animation: pulse 1s infinite;
    animation-delay: 5.55s;
}
@keyframes pulse {
    0% {
        transform: scaleY(0.9);
        transform-origin: 50% 50%;
    }

    50% {
        transform: scaleY(0.7);
        transform-origin: 50% 50%;
    }

    100% {
        transform: scaleY(0.9);
        transform-origin: 50% 50%;
    }
}
</style>