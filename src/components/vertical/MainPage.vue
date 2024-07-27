<template>
  <v-main>
    <div class="topic-list" v-for="topic in mainTopics" :key="topic.uId">
      <div class="title">
        <h1 class="text-center text-wrap title-h1">
          {{topic.title}}</h1>
      </div>
      <div class=" card mb-3">
        <div class="main-card ps-1 py-1"
          :style="{'background-image': `radial-gradient(circle at center center, rgba(28,27,27, 0.78),rgba(0,0,0, 0.69)),${getBackgroundImage(topic)}`}">
          <div class="d-flex justify-content-center arrow-up py-3">
            <v-icon color="darkgray" style="z-index: 100;" v-if="!isScrolledToTop || isScrolledToBottom"
              class="mdi mdi-chevron-double-up" @click="scrollToTop"></v-icon>
          </div>
          <div class=" full-desc" @scroll="handleScroll">
            <p class=" text-wrap text-start description" v-html="formattedDescription(topic.description)"></p>
            <div v-if="topic.combinedDataSubList && topic.combinedDataSubList.length >=1 " class="list">
              <ul v-for="sub in topic.combinedDataSubList" :key="sub.commonId" style="z-index: 2;"
                class="list-unstyled my-0">
                <li @click="goToSub(sub)" class="subtopics" style="font-size: 100%;"><v-icon
                    class="mdi mdi-arrow-right arrow me-2 my-0" size="22"></v-icon>{{
                  sub.title }}
                  <div v-if="sub.combinedDataSubSubList && sub.combinedDataSubSubList.length >=1" class="ms-5">
                    <ul v-for="top in sub.combinedDataSubSubList" :key="top.commonId" class="list-unstyled">
                      <li style="font-size: 90%;" class="my-0" @click="goToSub2(top,$event)"><v-icon
                          class="mdi mdi-arrow-right arrow2 me-2" size="18"></v-icon>{{ top.title }}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="d-flex justify-content-center arrow-down py-3">
            <v-icon color="darkgray" style="z-index: 100;" class="mdi mdi-chevron-double-down"
              v-if="(isScrolledToTop || !isScrolledToBottom) && hasScroll()" @click="scrollToBottom"></v-icon>
          </div>
        </div>
        <v-card class="carousel-wrapper bg-transparent" elevation="10"
          v-if="topic.imgDataList && topic.imgDataList.length > 0">
          <v-carousel class="sub-carousel" hide-delimiters cover :show-arrows="false" cycle interval="3000"
            :touch="true" style="" height="100%">
            <v-carousel-item @click="openDialog(image.furl)" v-for="image in topic.imgDataList" :key="image.furl"
              class="sub-carousel image-box " cover :src="image.furl">
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </div>
      <div class="nav mb-3">
        <router-link to="/digitalBoard/selectedTopics">
          <v-btn icon="mdi-home" variant="outlined" elevation="10" class="home-btn"></v-btn>
        </router-link>
        <v-card class="translate-btn text-capitalize p-2 rounded-5" elevation="10" @click="translate">
          <svg width="30" height="30" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="svg-icon">
            <g opacity="1">
              <path fill-rule="evenodd" clip-rule="evenodd" class="svg-path" :d="path1" fill="#5D4037" />
              <path class="svg-path" :d="path2" fill="#5D4037" />
            </g>
          </svg></v-card>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="650">
      <v-img :src="selectedImage" contain></v-img>
    </v-dialog>
  </v-main>
</template>

<script>
export default {
  data(){
    return {
      dialog: false,
      selectedImage: null,
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2,
      isScrolledToBottom: false,
      isScrolledToTop: true
    }
  },
  computed: {
    mainTopics() {
      return this.$store.getters.getMainData;
    },
    language() {
      return this.$store.getters.getLanguage;
    }
  },
  // created() {
  //   this.checkScrollPosition();  
  // },
  mounted() {
    document.body.style.backgroundImage = 'linear-gradient(to bottom right, #110b03, #3e7132)'
    this.goToTopic();
  
  },
  unmounted() {
    document.body.style.backgroundImage = ''
  },
  methods: {
    hasScroll() {
      const fullDescElement = document.querySelector('.full-desc');
      if (fullDescElement) {
        return fullDescElement.scrollHeight > fullDescElement.clientHeight;
      } else {
        return false; // Handle case where element not found
      }
    },
    goToSub(topic) { 
        this.$store.commit('setFirstSub', topic);
        this.$router.push({name:'subPage-portrait'});
    },
    goToSub2(topic, event) { 
      event.stopPropagation();
      this.$store.commit('setSecondSub', topic);
      this.$router.push({ name: 'sub2Page-portrait' });
    },
    getBackgroundImage(topic) {
      const defaultImg = require('@/assets/ancient.jpg');
      if (topic.imgDataList && topic.imgDataList.length > 0) {
        const backgroundImage = topic.imgDataList[0].furl || '';
        return `url(${backgroundImage})`;
      }
      return `url(${defaultImg})`;
    },
    openDialog(imageSrc) {
      this.selectedImage = imageSrc;
      this.dialog = true;
    },
    translate() {
      if (this.language == 1) {
        this.$store.commit('setLanguage', 2);
      } else {
        this.$store.commit('setLanguage', 1);
      }
      this.goToTopic()
    },
    formattedDescription(description) {
      if (description) {
        return description.replace(/\n/g, '<br>');
      }
      else return '';
    },
    async goToTopic() {
      await this.$store.dispatch('getMainDetails', {language: this.language, item: this.mainTopics[0].commonId})
    },
    // checkScrollPosition() {
    //   const fullDescElement = document.querySelector('.full-desc');
    //   if (fullDescElement) {
    //     this.isScrolledToBottom = fullDescElement.scrollHeight <= fullDescElement.clientHeight + fullDescElement.scrollTop;
    //   } else {
    //     console.error('Element with class "full-desc" not found');
    //   }
    // },
    scrollToBottom() {
      const fullDescElement = document.querySelector('.full-desc');
      this.smoothScrollToBottom(fullDescElement);
    },
    scrollToTop() {
      const fullDescElement = document.querySelector('.full-desc');
      this.smoothScrollToTop(fullDescElement);
    },
    smoothScrollToBottom(element) {
      let scrollTop = element.scrollTop;
      const targetScrollTop = element.scrollHeight;
      const step = targetScrollTop / 55; 
      const scrollInterval = setInterval(() => {
        if (scrollTop < targetScrollTop) {
          scrollTop += step;
          element.scrollTop = scrollTop;
        } else {
          clearInterval(scrollInterval);
        }
      }, 10);
      this.isScrolledToBottom = true;
      
    },
    smoothScrollToTop(element) {
      let scrollTop = element.scrollTop;
      const targetScrollTop = 0; 
      const step = scrollTop / 55; 
      const scrollInterval = setInterval(() => {
        if (scrollTop > targetScrollTop) {
          scrollTop -= step;
          element.scrollTop = scrollTop;
        } else {
          clearInterval(scrollInterval);
        }
      }, 10);
      this.isScrolledToTop = true;
    },
    handleScroll() {
      const fullDescElement = document.querySelector('.full-desc');
      this.isScrolledToBottom = fullDescElement.scrollHeight <= fullDescElement.clientHeight + fullDescElement.scrollTop+ 0.9;
      this.isScrolledToTop = fullDescElement.scrollTop === 0;
    },
  },
  
}
</script>

<style scoped>
@keyframes scaleUpDown {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes slide {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(7px, 0);
  }
}
@keyframes slide2 {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(5px, 0);
  }
}
@keyframes slideY {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(0, 5px);
  }
}
.topic-list{
  height: 100vh;
  background: #e9e1d7;
  background-image: url('@/assets/cream.jpg');
  background-size: cover;
  background-position: center;
  color: #1c1405;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title{
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-h1{
  color: #1c1405;
  font-size: 200%;
  font-weight: 700;
}
.card{
  background-color: transparent;
  border: none;
}
.main-card {
  border-radius: 0px 30px 30px 0px;
  width: 100%;
  height: 60vh;
  border: 2px solid cornsilk;
  border-left: none;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: #ffffff;
}
.main-card li {
  font-size: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 400;
  text-align: start;
}
.image-box {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  border: 2px solid rgb(247, 236, 194);
}
:deep(.carousel-wrapper .v-btn) {
  background-color: transparent;
}
.sub-carousel {
  width: 100%;
  height: 100%;
}
.translate-btn {
  border: 1px solid #5D4037;
  animation: scaleUpDown 2s ease-in-out infinite;
  animation-delay: 0.8s;
  background-color: transparent;
}
.home-btn {
  animation: scaleUpDown 2s ease-in-out infinite;
  animation-delay: 0.8s;
  background-color: transparent;
  color: #5D4037;
}
.subtopics {
  cursor: pointer;
  font-size: 100%;
  font-weight: 400;
}
.nav{
  display: flex;
  justify-content:space-between;
  align-items:center;
  margin-inline: 5px;
}
.arrow{
  animation: slide 1s ease-in-out infinite;
    margin-left: 9px;
}
.arrow2{
  animation: slide2 1s ease-in-out infinite;
  margin-left: 1px;
}
.arrow-down, .arrow-up{
  animation: slideY 2s ease-in-out infinite;
  animation-delay: .2s;
}
::-webkit-scrollbar {
  display: none;
}
@media only screen and (orientation: portrait) {
  .topic-list {
    justify-content: center;
    position: relative;
  }
  .title h1{
    margin-top: 2%;
    margin-bottom: 2%;
    position: absolute;
    top: 2%; 
  }
.card{
  margin-inline: auto;
  width: 80%;
  position: absolute;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
}
.main-card{
  height: 75vh;
  border-radius: 30px 30px 30px 30px;
}
.desc {
  aspect-ratio: 1107 / 600;
}
.carousel-wrapper {
  aspect-ratio: 813/650;
  position: absolute;
  left: 13%;
  top: -14%;
  width: 75%;
  height: 32%;
}
.carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.carousel-image {
  width: 95%;
  aspect-ratio: 1;
}
:deep(.description), .list{
  font-size: 110%;
  padding-left: 25px;
}
.full-desc{
  width: 90%;
  height:43vh;
  overflow-x:hidden;
  position: absolute;
  overflow-y: scroll;
  top: 25%;
}
.arrow-down{
  position: absolute;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
}
.arrow-up {
  position: absolute;
  top: 17%;
  left: 50%;
  transform: translateX(-50%);
}
}
@media only screen and (orientation: landscape) {
.card{
  width: 80%;
  position: relative;
}
.main-card {
  height: 80vh;
 
}
.carousel-wrapper {
  aspect-ratio: 813/650;
  position: absolute;
  left: 84%;
  top: 15%;
  width: 40%;
  height:70%
}
.carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.carousel-image {
  width: 95%;
  aspect-ratio: 1;
}

:deep(.description){
  font-size: 110%; 
}
.full-desc{
  width: 85%;
  height:80%;
  overflow-x:hidden;
  padding-inline: 50px;
  overflow-y: scroll;
}
.nav{
  margin-inline: 45px; 
  padding-right: 10px;
}
}
</style>