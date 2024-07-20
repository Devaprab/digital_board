<template>
  <v-main class="main">
    <header class=" py-3 d-flex justify-content-between my-2 mx-5">
      <h3 class=" select-topic text-uppercase">Select Topics</h3>
      <v-btn class="translate-btn text-capitalize px-3" size="large" rounded @click="toggleDtId" variant="outlined"
        elevation="10" >
        <svg width="30" height="30" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-icon">
          <g opacity="1">
            <path fill-rule="evenodd" clip-rule="evenodd" class="svg-path" :d="path1" fill="#216D17" />
            <path class="svg-path" :d="path2" fill="#216D17" />
          </g>
        </svg>Translate</v-btn>
    </header>

    <div class="d-flex gap-4 ms-5 flex-column flex-wrap">
      <div class="d-flex gap-2 align-items-center py-1" v-for="(topic, index) in topics" :key="index"
        style="width: fit-content;">
        <h5>{{ index + 1 }}.</h5>
        <div class="new-arrow d-flex align-items-center justify-content-center elevation-{5}"
          @click="toggleHighlight(index, topic)" :class="{ 'highlighted': isHighlighted(index) }">
          <p class="text-center my-3 topics">{{ topic.title }}</p>
        </div>
      </div>
    </div>
    <footer class="fixed-bottom pb-4 d-flex justify-content-end me-5">
      <v-btn color="#1B5E20" variant="tonal" size="x-large" rounded class="submit"> <v-icon size="50"
          @click="submitSelection">mdi-menu-right</v-icon></v-btn>
    </footer>
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
    // handleCheckboxChange(topic) {
    //   if (this.selectedTopics.includes(topic)) {
    //     this.selectedTopics = this.selectedTopics.filter(t => t !== topic);
    //   } else {
    //     if (this.selectedTopics.length < 4) {
    //       this.selectedTopics.push(topic);
    //     } else {
    //       this.selectedTopics.shift();
    //       this.selectedTopics.push(topic);
    //     }
    //   }
    // },
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
      console.log(this.selectedTopics)
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
.main{
  background: #FDFAF6;
    background-image: url('@/assets/noise.svg');
    background-size: contain;
    background-position: center;
    background-repeat: repeat;
    height: 100%;
    width: 100%;
}
.select-topic{
  font-size: 36px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1B5E20;
}
.new-arrow {
  width: 50rem;
  height: 3.5rem;
  /* background-color: #1B5E20; */
  /* background-image: linear-gradient(to bottom right, #2e1e0a, #3e7132); */
  background: url('@/assets/green.png');
  background-size: contain;
  color: rgb(251, 247, 242);
  transition: transform 0.8s, scale 0.5s ease, margin-left 0.8s ease, border-radius 0.5s ease, border 0.5s ease, background-image 0.8s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.571);
  border-radius: 0 0px 40px 0;
}
.highlighted {
  transform: scale(1.1);
  margin-left: 48px;
  /* background-image: linear-gradient(to top left, #110b03, #3e7132); */
  border-radius: 0 40px 0px 0;
  border: 3px solid rgb(166, 139, 18);
  box-shadow: 0 4px 8px rgba(58, 10, 10, 0.362);
}
.topics{
  font-size: 18px;
  font-weight: 400;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.translate-btn{
  background-color: #043e04;
  color: #f7f4d3 !important;
  
}
.svg-path{
fill: #f7f4d3 !important;
}
.submit{
  margin-bottom: 30px;
  animation: scale-up 1.5s infinite;
}
@keyframes scale-up {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
.topic-list {
height: 100vh;
/* background-image: linear-gradient(to bottom, rgb(1, 39, 3), #74a965aa); */
background-image: linear-gradient(to bottom right, #110b03, #3e7132);

font-family: Arial, sans-serif;
color: #ffffff;
padding: 20px;
}

.topic-list h1 {
font-family: "Prata", serif;
font-weight: 600;
font-style: normal;
letter-spacing: 2px;
font-size: 4em;
margin-bottom: 20px;
color: #ffffff;
text-align: center;
}
label {
font-size: 2rem;
font-family: "Prata", serif;
}
input[type="checkbox"] {
margin-right: 10px;
transform: scale(2.5);
}
.topics {
display: grid;
grid-template-columns: repeat(3, 1fr);
grid-auto-rows: auto;
gap: 24px;
}

.two {

}
.new-arrow {

}

.highlighted {
transform: scale(1.2);
background-color: yellow;
}