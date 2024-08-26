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
      inactivityDuration: 120000
    };
  },
  methods: {
    resetInactivityTimeout() {
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }
      this.inactivityTimeout = setTimeout(this.handleInactivity, this.inactivityDuration);
    },
    handleInactivity() {
      if (this.$route.path != '/digitalBoard/' && this.$store.getters.getSelectedTopics.length > 1) {
        this.$router.push('/digitalBoard/selectedTopics');
      }
      if (this.$route.path != '/digitalBoard/detailsPage' && this.$store.getters.getSelectedTopics.length == 1) {
        this.$router.push('/digitalBoard/detailsPage');
      }
    },
  },
  mounted() {
    this.resetInactivityTimeout();
    document.addEventListener('touchstart', this.resetInactivityTimeout);
    document.addEventListener('mousemove', this.resetInactivityTimeout);
    document.addEventListener('mousedown', this.resetInactivityTimeout);
    document.addEventListener('keydown', this.resetInactivityTimeout);
    document.addEventListener('scroll', this.resetInactivityTimeout);
  },
  beforeUnmount() {
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
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@100..900&family=Noto+Serif+Malayalam:wght@100..900&display=swap');
/* Default font for English or other languages */
.default-font * {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Font for Malayalam */
.malayalam-font * {
  font-family: 'Noto Sans Malayalam', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
