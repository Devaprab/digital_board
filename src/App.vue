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
      // inactivityDuration: 10000,
      // ipAddress: null
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
      if (this.$route.path != '/digitalBoard/' && this.$store.getters.getSelectedTopics.length > 1) {
        this.$store.commit('setResetTime', false);
        this.$router.push('/digitalBoard/selectedTopics');
      }

      if ((this.$route.path != '/digitalBoard/detailsPage' && this.$route.path != '/digitalBoard/') && this.$store.getters.getSelectedTopics.length == 1) {
        this.$store.commit('setResetTime', false);
        this.$router.push('/digitalBoard/detailsPage');
      }
      
      if ((this.$route.path == '/digitalBoard/detailsPage' && this.$route.path != '/digitalBoard/') && this.$store.getters.getSelectedTopics.length == 1) {
        this.$store.commit('setResetTime', true);
      }
    } else {
    console.log("Navigation skipped due to video playing.");
  }
    },

    async getIP(){
      try{
        let ip= location.href.split("?")[1].split("=")[1]
        console.log("ipaddress",ip);
        this.$store.commit('setIp', ip);
        const res = await this.$store.dispatch('sendIpAddress', this.ipAddress);
        console.log('before if cms response',res);
        if (res) {
          console.log('cms response',res);
            if (this.$store.getters.getSelectedTopics.length > 1) {
              this.$router.push('/digitalBoard/selectedTopics')
            } else {
              this.$router.push({ name: 'detailsPage' })
            }
          }
      }
      catch (error) {
        console.error('Error fetching IP address:', error);
      }
    },
    // async getPublicIP() {
    //   try {
    //     const response = await axios.get('https://api.ipify.org?format=json');
    //     if (response.status >= 200 || response.status < 300) {
    //       this.$store.commit('setIp',response.data.ip);
    //       const res = await this.$store.dispatch('sendIpAddress', this.ipAddress);
    //       if (res) {
    //         if (this.$store.getters.getSelectedTopics.length > 1) {
    //           this.$router.push('/digitalBoard/selectedTopics')
    //         } else {
    //           this.$router.push({ name: 'detailsPage' })
    //         }
    //       }
    //     }
    //   }
    //   catch (error) {
    //     console.error('Error fetching IP address:', error);
    //   }
    // },
  },
  created() {
    this.getIP();
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

    console.log(window.location.href);
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
    console.log("Current isVideoPlaying state:", playing); // Debug log
    return playing;
  }
  }
};
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@100..900&family=Noto+Serif+Malayalam:wght@100..900&display=swap'); */
/* Default font for English or other languages */
@font-face {
  font-family: 'Noto Serif Malayalam, serif';
  src: url('@/assets/fonts/Noto_Serif_Malayalam/NotoSerifMalayalam-VariableFont_wght.ttf') format('truetype');
   
}
.default-font * {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Font for Malayalam */
.malayalam-font * {
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
