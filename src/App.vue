<template>
  <v-app :class="fontClass" class="p-0 m-0">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      inactivityTimeout: null,
      inactivityDuration: 90000,
    };
  },
  methods: {
    resetInactivityTimeout() {
      if (this.isVideoPlaying) {
        return;
      }
      if (this.inactivityTimeout) {
        this.$store.commit('setResetTime', false);
        clearTimeout(this.inactivityTimeout);
      }
      this.inactivityTimeout = setTimeout(this.handleInactivity, this.inactivityDuration);
    },
    handleInactivity() {
      if (!this.isVideoPlaying) {
        if (this.$route.path != '/digitalBoard/' && this.$store.getters.getSelectedCommonIds.length > 1) {
          this.$store.commit('setResetTime', false);
          this.$router.push('/digitalBoard/selectedTopics');
        }
        if ((this.$route.path != '/digitalBoard/detailsPage' && this.$route.path != '/digitalBoard/') && this.$store.getters.getSelectedCommonIds.length == 1) {
          this.$store.commit('setResetTime', false);
          this.$router.push('/digitalBoard/detailsPage');
        }
        if ((this.$route.path == '/digitalBoard/detailsPage' && this.$route.path != '/digitalBoard/') && this.$store.getters.getSelectedCommonIds.length == 1) {
          this.$store.commit('setResetTime', true);
        }
      } else {
        console.log("Navigation skipped due to video playing.");
      }
    }
    },
    mounted() {
      this.resetInactivityTimeout();
      // Add event listeners for user activity
      document.addEventListener('touchstart', this.resetInactivityTimeout);
      document.addEventListener('play', this.resetInactivityTimeout);
      document.addEventListener('playing', this.resetInactivityTimeout);
      document.addEventListener('mousemove', this.resetInactivityTimeout);
      document.addEventListener('mousedown', this.resetInactivityTimeout);
      document.addEventListener('keydown', this.resetInactivityTimeout);
      document.addEventListener('scroll', this.resetInactivityTimeout);
    },
    beforeUnmount() {
      document.removeEventListener('play', this.resetInactivityTimeout);
      document.removeEventListener('playing', this.resetInactivityTimeout);
      document.removeEventListener('touchstart', this.resetInactivityTimeout);
      document.removeEventListener('mousemove', this.resetInactivityTimeout);
      document.removeEventListener('mousedown', this.resetInactivityTimeout);
      document.removeEventListener('keydown', this.resetInactivityTimeout);
      document.removeEventListener('scroll', this.resetInactivityTimeout);
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }
    },

    computed: {
      language() {
        return this.$store.getters.getLanguage;
      },
      fontClass() {
        return this.language == 1 ? 'malayalam-font' : 'default-font';
      },
      ipAddress() {
        return this.$store.getters.getIpAddress;
      },
      isVideoPlaying() {
        const playing = this.$store.getters.getIsVideoPlaying;
        return playing;
      }
  },
  watch: {
    isVideoPlaying() {
      this.resetInactivityTimeout();
    }
  }
};
</script>

<style>
@font-face {
   font-family: 'ShapesNoto-Regular,serif';
   src: url('@/assets/fonts/ShapesNoto-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'Noto Serif Malayalam, serif';
  src: url('@/assets/fonts/Noto_Serif_Malayalam/NotoSerifMalayalam-VariableFont_wght.ttf') format('truetype');
}
.mal-text {
  font-family: 'Noto Serif Malayalam, serif' !important;
}
.default-font * {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.malayalam-font * {
  /* font-family: 'ShapesNoto-Regular,serif'; */
  font-family: 'Noto Serif Malayalam, serif';
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-optical-sizing: auto;
  font-style: normal;
  user-select: none
}
</style>
