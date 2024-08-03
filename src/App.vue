<template>
  <v-app class="p-0 m-0">
       <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      inactivityTimeout: null,
      inactivityDuration: 30000,
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
      if (this.$route.path === '/digitalBoard/') {
        console.log('hello');
      } else {
        this.$router.push('/digitalBoard/selectedTopics');
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
};
</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>