<template>
  <v-main class="main">
    <header class=" pt-3 d-flex justify-content-between mx-5">
      <h3 class=" select-topic text-uppercase">Select Topics</h3>
    </header>

    <div class="topic-list-display">
      <div class="d-flex align-items-center py-1" v-for="(topic, index) in topics" :key="index"
        style="width: fit-content;">
        <h5 class="me-2">{{ index + 1 }}.</h5>
        <div class="new-arrow d-flex align-items-center justify-content-center elevation-{5}"
          @click="toggleHighlight(index, topic)" :class="{ 'highlighted': isHighlighted(index) }">
          <p class="text-center my-3 topics text-wrap p-2">{{ topic.title }}</p>
        </div>
      </div>
    </div>

    <div class="submit-btn w-100">
      <v-card class="translate-btn text-capitalize p-2 rounded-5" width="50" height="50"
        @click="toggleDtId">
        <svg width="30" height="30" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-icon">
          <g opacity="1">
            <path fill-rule="evenodd" clip-rule="evenodd" class="svg-path" :d="path1" fill="#5D4037" />
            <path class="svg-path" :d="path2" fill="#5D4037" />
          </g>
        </svg></v-card>
      <v-btn color="#1B5E20" variant="tonal" size="x-large" rounded class="submit"> <v-icon size="50"
          @click="submitSelection">mdi-menu-right</v-icon></v-btn>
    </div>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      selectedTopics: [],
      highlightedDivs: [],
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2
    };
  },
  computed: {
    topics() {
      return this.$store.getters.getTopics || [];
    },
    language() {
      return this.$store.getters.getLanguage;
    }
  },
  mounted() {
    this.getTopics();
  },
  methods: {
    async getTopics() {
      try {
        await this.$store.dispatch('getTopics', this.language)
      }
      catch (error) {
        console.log(error);
      }
    },
    async toggleDtId() {
      if (this.language == 1) {
        this.$store.commit('setLanguage', 2);
      } else {
        this.$store.commit('setLanguage', 1);
      }
      try {
        await this.getTopics();
      }
      catch (error) {
        console.error(error)
      }
    },
    toggleHighlight(index, topic) {
      const idx = this.highlightedDivs.indexOf(index);
      if (idx === -1) {
        if (this.selectedTopics.length < 4) {
          this.highlightedDivs.push(index);
          this.selectedTopics.push(topic.commonId)
        } else {
          this.selectedTopics.shift();
          this.highlightedDivs.shift();
          this.highlightedDivs.push(index);
          this.selectedTopics.push(topic.commonId);
        }
      } else {
        this.highlightedDivs.splice(idx, 1);
        this.selectedTopics.shift();
      }
    },
    isHighlighted(index) {
      return this.highlightedDivs.includes(index);
    },
    async submitSelection() {
      if (this.selectedTopics.length < 1) {
        alert('Please select at least one topic.');
        return;
      }
      if (this.selectedTopics.length >= 5) {
        alert('You can select a maximum of 4 topics.');
        return;
      }
      try {
        this.$store.commit('setCommonIds', this.selectedTopics)
        const res = await this.$store.dispatch('selectedTopics', {
          language: this.language,
          selectedTopics: this.selectedTopics,
        });
        if (res) {
          this.$router.push('/digitalBoard/selectedTopics')
        }
      }
      catch (error) {
        console.error('Error submitting topics', error);
      }
    }
  }
};
</script>

<style scoped>
.main {
  background: #FDFAF6;
  background-image: url('@/assets/noise.svg');
  background-size: contain;
  background-position: center;
  background-repeat: repeat;
  height: 100%;
  width: 100%;
  position: relative;
}
.topic-list-display{
  display: flex;
  margin-left: 45px;
  flex-direction: column; 
  justify-content: start;
  flex-wrap: wrap;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 20px;
  height: 80vh;
}
::-webkit-scrollbar {
  display: none;
}
.select-topic {
  font-size: 36px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1B5E20;
}
.new-arrow {
  width: 28rem;
  height: 4.5rem;
  background: url('@/assets/green.png');
  background-size: contain;
  color: rgb(251, 247, 242);
  transition: transform 0.8s, scale 0.5s ease, margin-left 0.8s ease, border-radius 0.5s ease, border 0.5s ease, background-image 0.8s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.571);
  border-radius: 0 0px 40px 0;
}

.highlighted {
  transform: scale(1.1);
  margin-left: 32px;
  border-radius: 0 40px 0px 0;
  border: 2px solid rgb(166, 139, 18);
  box-shadow: 0 4px 8px rgba(58, 10, 10, 0.362);
}
.topics {
  font-size: 16px;
  font-weight: 400;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.translate-btn {
  background-color: #1b5e1f2f;
  color: #f7f4d3 !important;
  border: 2px solid #40584284;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  /* margin-top: 15px; */
}
.svg-path {
  fill: #1B5E20 !important;
}
.submit {
  margin-bottom: 30px;
  animation: scale-up 2s ease-in-out infinite;
  animation-delay: .5s;
  border: 2px solid #40584284;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
}
@keyframes scale-up {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
.submit-btn {
  display: flex;
  justify-content: end;
  gap: 15px;
  position: absolute;
  bottom: 0;
  top: 90%;
  padding-top: 5px;
  /* right: 5%; */
}
@media only screen and (orientation: portrait){
.topic-list-display{
  flex-wrap: nowrap;
  overflow-y: auto;
  overflow-x: hidden;
}
}
</style>
