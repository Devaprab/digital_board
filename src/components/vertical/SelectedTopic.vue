<template>
  <v-main class="main">
    <div class="d-flex justify-content-end translate-card py-5">
      <v-btn class="text-capitalize" @click="toggleDtId" size="x-large" variant="outlined">
        <svg width="50" height="50" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.8">
            <path fill-rule="evenodd" clip-rule="evenodd" :d="path1" fill="#216D17" />
            <path :d="path2" fill="#216D17" />
          </g>
        </svg>
        Translate</v-btn>
    </div>

    <div class="topic-card  ">
      <!-- <v-img src="@/assets/AksharamLogo.png" height="700" class="logo" alt="logo" max-height="700"></v-img> -->

      <topic-card :Topics="Topics"></topic-card>
    </div>

  </v-main>
</template>

<script>
import TopicCard from './TopicCard.vue'
import { mapGetters } from 'vuex';
export default {
  components: { TopicCard },
  data() {
    return {
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2
    }
  },
  computed: {
    ...mapGetters(['getSelectedTopics','getSelectedCommonIds','getLanguage']),
    Topics() {
      return this.getSelectedTopics;
    },
    language() {
      return this.getLanguage;
    },
    commonId() {
      return this.getSelectedCommonIds;
    }
  },
 
  methods: {
    async toggleDtId() {
      if (this.language === 1) {
        this.$store.commit('setLanguage', 2);
      } else {
        this.$store.commit('setLanguage', 1);
      }
      const payload = {
        language: this.language,
        selectedTopics: this.commonId
      }
      console.log('Selected topics:', payload);
      try {
        await this.$store.dispatch('selectedTopics', payload) 
      }
      catch (error) {
        console.error(error)
      }
    },
  }
}
</script>
<style scoped>


@media only screen and (orientation: portrait) {
  .main{
  background: #FDFAF6;
  background-image: url('@/assets/noise.svg');
    background-size: cover;
   background-position: center;
    height: 100%;
    /* margin: 0; */
}

.topic-card, .translate-card{
  margin-inline: 4%;
  display: flex;                  
  flex-direction: column;      
  justify-content: center;
}
.topic-card{
  height: 90%;
}
.logo{
margin-bottom: 8%;
}
}

@media only screen and (orientation: landscape) {
  .main{
  background: #FDFAF6;
  background-image: url('@/assets/noise.svg');
    background-size: cover;
   background-position: center;
    height: 100%;
    /* margin: 0; */
}

.topic-card, .translate-card{
  margin-inline: 4%;
  display: flex;                  
  flex-direction: row;        
  justify-content: center;
  gap: 1.5rem;
}
.topic-card{
  height: 90%;
}
.logo{
margin-bottom: 8%;
}
}

</style>