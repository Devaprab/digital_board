<template>
  <div>
    <div class="topic-list">
      <div class="title">
        <h1 class="text-center text-wrap mb-4 mx-3 mt-2 title-h1">
          {{topic.title}}</h1>
      </div>

      <div class=" card mb-3">
        <div class="main-card p-4" :style="{
  'background-image': `radial-gradient(circle at 16% 83%, rgba(148, 148, 148,0.06) 0%, rgba(148, 148, 148,0.06) 50%,rgba(63, 63, 63,0.06) 50%, rgba(63, 63, 63,0.06) 100%),radial-gradient(circle at 68% 87%, rgba(66, 66, 66,0.06) 0%, rgba(66, 66, 66,0.06) 50%,rgba(105, 105, 105,0.06) 50%, rgba(105, 105, 105,0.06) 100%),radial-gradient(circle at 38% 50%, rgba(123, 123, 123,0.06) 0%, rgba(123, 123, 123,0.06) 50%,rgba(172, 172, 172,0.06) 50%, rgba(172, 172, 172,0.06) 100%),linear-gradient(90deg, rgba(12,3,3, 0.93),rgba(12,3,3, 0.93)),${getBackgroundImage(topic)}`
        }">

          <div style="" class="mt-4 full-desc">
            <p class=" text-wrap text-start description" v-html="formattedDescription(topic.description)">
            </p>
            <div v-if="topic.combinedDataSubSubList && topic.combinedDataSubSubList.length >= 1" class="px-5">
              <ul v-for="sub in topic.combinedDataSubSubList" :key="sub.commonId">
                <li class="subtopics" @click="goToSub(sub)">{{ sub.title }}</li>
              </ul>
            </div>
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
      <div class="nav mx-5 mb-3 pe-3">
        <router-link to="/digitalBoard/detailsPage/portrait">
          <v-btn icon="mdi-home" variant="outlined" elevation="10" color="#5D4037" class="home-btn"></v-btn>
        </router-link>
        <v-card class="translate-btn text-capitalize p-2 rounded-5 bg-transparent" elevation="10" @click="translate">
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
  </div>
</template>
<script>
export default ({
    data(){
    return {
      dialog: false,
      selectedImage: null,
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2
    }
  },
    computed: {
        topic() {
            return this.$store.getters.getFirstSub;
        },
        language() {
            return this.$store.getters.getLanguage;
        }
    },
    mounted() {
    document.body.style.backgroundImage = 'linear-gradient(to bottom right, #110b03, #3e7132)'
    this.goToTopic();
      console.log(window.innerHeight)
      console.log(window.innerWidth)
    
  },
  unmounted() {
    document.body.style.backgroundImage = ''
  },
    methods: {
       
        goToSub(topic) {
           
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
      await this.$store.dispatch('getSubDetails', { id: this.topic.fsCommonId, language: this.language,})
    }
    }
})
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
.topic-list{
  height: 100dvh;
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
  font-size: 120%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  text-align: justify;
}
.desc {
  width: 100%;
  font-size: 110%;
  line-height: 180%;
  height: auto;
  white-space: pre-wrap;
  overflow-x: hidden;
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
}
.home-btn {
  animation: scaleUpDown 2s ease-in-out infinite;
  animation-delay: 0.8s;
}
.subtopics {
  cursor: pointer;
  font-size: 110%;
  font-weight: 400;
}
.nav{
  display: flex;
  justify-content:space-between;
  align-items:center;
}
.arrow{
  animation: slide 1s ease-in-out infinite;
    margin-left: 9px;
}
.arrow2{
  animation: slide2 1s ease-in-out infinite;
  margin-left: 1px;
}
::-webkit-scrollbar,
:deep(::-webkit-scrollbar) {
  width: 5px;
  height: auto;
}
::-webkit-scrollbar-track,
:deep(::-webkit-scrollbar-track) {
  background: #272B25;
}
::-webkit-scrollbar-thumb,
:deep(::-webkit-scrollbar-thumb) {
  background: #8D9387;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb:hover,
:deep(::-webkit-scrollbar-thumb:hover) {
  background: #f5eded;
  cursor: pointer;
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
    top: 5%; 
  }
.card{
  margin-inline: auto;
  width: 80%;
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
}
.main-card{
  height: 70dvh;
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
  height:90%;
  overflow-x:hidden;
  position: absolute;
  top: 25%;
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
  height:90%;
  overflow-x:hidden;
  padding-inline: 10px;
}
}
</style>