<template>
  <v-main class="main">
    <div class="topic-card ">
      <topic-card :Topics="Topics" :loadingTopic="loadTopic"></topic-card>
    </div>
    <div class="d-flex justify-content-end translate-card w-100">
      <v-btn class="text-capitalize btn-style" @click="toggleDtId" size="large" variant="tonal" elevation="10" rounded
        color="#1b1008">
        <svg width="40" height="40" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.8">
            <path fill-rule="evenodd" clip-rule="evenodd" :d="path1" fill="#1b1008" />
            <path :d="path2" fill="#1b1008" />
          </g>
        </svg>
        Translate
      </v-btn>
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
      path2: this.$store.getters.getPath2,
      loadTopic: false
    }
  },
  mounted() {
    this.getTopics({
      language: this.language,
      selectedTopics: this.commonId
    });
  },
  computed: {
    ...mapGetters(['getSelectedTopics', 'getSelectedCommonIds', 'getLanguage']),
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
      this.getTopics(payload);
    },
    async getTopics(payload) {
      try {
        this.loadTopic = true;
        const res = await this.$store.dispatch('selectedTopics', payload)
        if (res) {
          this.loadTopic = false;
        }
      }
      catch (error) {
        this.loadTopic = false;
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.translate-card .btn-style {
  border: 2px solid #2a1a0e;
}
@media only screen and (orientation: portrait) {
  .main {
    background: #FDFAF6;
    background-image: url('@/assets/noise.svg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    padding-block: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .topic-card {
    margin-inline: 4%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
@media only screen and (orientation: landscape) {
  .main {
    background: #FDFAF6;
    background-image: url('@/assets/noise.svg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
  }
  .topic-card {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    width: 95vw;
    overflow-x: auto;
    overflow-y: hidden;
    padding-block: 55px;
  }
  .translate-card {
    position: absolute;
    bottom: 3%;
    right: 3%;
  }
}
</style>