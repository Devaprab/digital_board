<!-- <template>
    <div class="topic-list">
        <div class="d-flex justify-content-center align-items-start nav mt-2 mb-2 mx-2">
            <h1 style="color: white; font-size: 260%;" class="text-center text-wrap">{{ topic.title }}</h1>
        </div>
        <div class=" card mx-auto">
            <div class="main-card p-4">
                <p class="text-wrap  text-justify px-5 mt-5" v-html="topic.description">
                </p>
                <div v-if="topic.combinedDataSubSubList && topic.combinedDataSubSubList.length >= 1" class="px-5">
                    <ul v-for="sub in topic.combinedDataSubSubList" :key="sub.commonId">
                        <li class="subtopics" @click="goToSub(sub)">{{ sub.title }}</li>
                    </ul>
                </div>
                <Carousel v-if="topic.imgDataList && topic.imgDataList.length" :items-to-show="2.5" :wrap-around="true"
                    class="mx-5">
                    <Slide v-for="image in topic.imgDataList" :key="image.imgID">
                        <div class="carousel__item">
                            <img :src="image.furl" :alt="image.fname" class="carousel-image" />
                        </div>
                    </Slide>
                    <template #addons>
                        <Navigation />
                    </template>
                </Carousel>
            </div>
        </div>
    </div>
</template> -->
<template>
    <div>
      <div class="topic-list d-flex flex-column justify-content-center">
        <div class="d-flex justify-content-center align-items-start">
          <h1 style="color: #1c1405; font-size: 200%; font-weight: 700;" class="text-center text-wrap mb-4">
            {{topic.title}}</h1>
        </div>
  
        <div class=" card">
          <div class="main-card p-4"
            :style="{ 'background-image': `radial-gradient(circle,rgba(37, 37, 37, 0.253), rgba(22, 18, 18, 0.982)), ${getBackgroundImage(topic)}` }">
            <div style="width: 64%; height:90%; overflow-x:hidden">
              <p class=" text-wrap text-justify px-5 mt-5 description" v-html="topic.description">
              </p>
              <div v-if="topic.combinedDataSubSubList && topic.combinedDataSubSubList.length >= 1" class="px-5">
                    <ul v-for="sub in topic.combinedDataSubSubList" :key="sub.commonId">
                        <li class="subtopics" @click="goToSub(sub)">{{ sub.title }}</li>
                    </ul>
                </div>
            </div>
          </div>
          <v-card class="carousel-wrapper" elevation="10">
            <v-carousel class="sub-carousel" hide-delimiters cover :show-arrows="false" cycle interval="3000"
            :touch="true" style="" height="100%">
            <v-carousel-item @click="openDialog(image.furl)" v-for="image in topic.imgDataList" :key="image.furl"
              class="sub-carousel image-box " cover :src="image.furl">
            </v-carousel-item>
          </v-carousel>
          </v-card>
        </div>
        <div class="d-flex justify-content-between align-items-center nav mx-5 mt-3 pe-3">
        <router-link to="/digitalBoard/detailsPage">
          <v-btn icon="mdi-arrow-left" variant="outlined" elevation="10" color="#5D4037" class="home-btn"></v-btn>
        </router-link>
        <v-btn class="translate-btn text-capitalize px-3" size="large" rounded @click="translate" variant="tonal"
          elevation="10" color="#5D4037">
          <svg width="30" height="30" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="svg-icon">
            <g opacity="1">
              <path fill-rule="evenodd" clip-rule="evenodd" class="svg-path" :d="path1" fill="#5D4037" />
              <path class="svg-path" :d="path2" fill="#5D4037" />
            </g>
          </svg>Translate</v-btn>
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
        }
    },
    mounted() {
    document.body.style.backgroundImage = 'linear-gradient(to bottom right, #110b03, #3e7132)'
   
      console.log(window.innerHeight)
      console.log(window.innerWidth)
    
  },
  unmounted() {
    document.body.style.backgroundImage = ''
  },
    methods: {
       
        goToSub(topic) {
           
                this.$store.commit('setSecondSub', topic);
                this.$router.push({ name: 'sub2Page' });
            
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
    }
})
</script>
<!-- <style scoped>
.topic-list {
  
    height: 100dvh;
  background-color: #2e2c0f;
  font-family: Arial, sans-serif;
  color: #ffffff;
  padding: 20px;
  overflow-x: hidden;
}
.home-btn {
    background-color: #FFB4AB;
    color: #690005;
}

.card {
    width: 90%;
    background-color: transparent;
    border: none;
}

.main-card {
  border-radius: 24px;
  width:100%;
  aspect-ratio: 1676 / 800;
  height: 90dvh;
  
  background: url('@/assets/cream.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  color: #311c07;
  overflow-x: hidden;
}

.desc {
    width: 100%;
    font-size: 110%;
    line-height: 180%;
    height: auto;
    aspect-ratio: 1107 / 600;
    white-space: pre-wrap;
    overflow-x: hidden;
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

:deep(pre){
  text-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: auto;
  max-height: auto;
  padding-right: 5px;
 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: justify;
  font-size: 120%;
  font-weight: 500;
}

.main-card li{
  font-size: 120%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;

  text-align: justify;
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
.subtopics {
    text-decoration: underline;
    cursor: pointer;
}
</style> -->

<style scoped>
.topic-list {
  height: 100dvh;
  
  /* background: #213413; */
  background: #e9e1d7;
    background-image: url('@/assets/cream.jpg');
    background-size: cover;
    background-position: center;
  font-family: Arial, sans-serif;
  color: #1c1405;
  /* padding-inline: 20px; */
  overflow-x: hidden;
}

/* .home-btn{
  background-color: #FFB4AB;
  color: #690005;
} */
.card{
  width: 80%;
  background-color: transparent;
  border: none;
  position: relative;
}
.main-card {
  border-radius: 0 30px 30px 0;
  width:100%;
  /* aspect-ratio: 1676 / 800; */
  height: 80vh;
  /* background-color: #363A33; */
  /* background: url('@/assets/cream.jpg'); */
  /* background: #f1eae1;
    background-image: url('@/assets/noise.svg');
  background-size:cover; */
  border: 2px solid cornsilk;
  border-left: none;
box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
    background-position: center;
    background-size: cover;
  background-repeat: no-repeat;
  color: #ffffff;
  /* overflow-x: hidden; */
}
.desc {
  width: 100%;
  font-size: 110%;
  line-height: 180%;
  height: auto;
  aspect-ratio: 1107 / 600;
  white-space: pre-wrap;
  overflow-x: hidden;

}
.carousel-wrapper {
  aspect-ratio: 813/650;
  position: absolute;
  left: 74%;
  top: 15%;

  width: 50%;
  aspect-ratio: 271 / 200;

}
.image-box{
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  border: 2px solid rgb(247, 236, 194);
  /* object-position: center; */
}
:deep(.carousel-wrapper .v-btn){
  background-color: transparent;
}
.sub-carousel {
  width: 100%;
  height: 100%;
}
::-webkit-scrollbar, :deep(::-webkit-scrollbar){
  width: 5px;
  height: auto; 
}
::-webkit-scrollbar-track, :deep(::-webkit-scrollbar-track) {
  background: #272B25;
}
::-webkit-scrollbar-thumb, :deep(::-webkit-scrollbar-thumb) {
  background: #8D9387;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb:hover, :deep(::-webkit-scrollbar-thumb:hover) {
  background: #f5eded;
  cursor: pointer;
}
:deep(pre){
  text-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: auto;
  max-height: auto;
  padding-right: 5px;
  font-family:Arial, Helvetica, sans-serif;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: justify;
  font-size: 120%;
  font-weight: 500;
}
.main-card li{
  font-size: 120%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  /* font-family: Arial, Helvetica, sans-serif; */
  text-align: justify;
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
.subtopics{
  /* text-decoration: underline; */
  cursor: pointer;
  font-size: 110%;
  font-weight: 400;
}
:deep(.description){
  font-size: 110%;
  
}

.translate-btn{
  border: 2px solid #5D4037;
}
.home-btn{
animation: scaleUpDown 1s ease-in-out infinite;
  animation-delay: 0.8s;
}
@keyframes scaleUpDown {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>