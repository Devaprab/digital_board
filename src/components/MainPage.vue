<template>
  <div>
    <div class="topic-list d-flex flex-column justify-content-center" v-for="topic in mainTopics" :key="topic.uId">
      <div class="d-flex justify-content-center align-items-start">
        <h1 style="color: #1c1405; font-size: 200%; font-weight: 700;" class="text-center text-wrap mb-4">
          {{topic.title}}</h1>
      </div>

      <div class=" card">
        <div class="main-card p-4"
          :style="{ 'background-image': `radial-gradient(circle,rgba(37, 37, 37, 0.253), rgba(22, 18, 18, 0.982)), ${getBackgroundImage(topic)}` }">
          <div style="width: 75%; height:95%; overflow-x:hidden">
            <p class=" text-wrap text-justify px-5 mt-5 description" v-html="topic.description">
            </p>
            <div v-if="topic.combinedDataSubList && topic.combinedDataSubList.length >=1 " class="px-5">
              <ul v-for="sub in topic.combinedDataSubList" :key="sub.commonId">
                <li @click="goToSub(sub)" class="subtopics">{{ sub.title }}
                  <div v-if="sub.combinedDataSubSubList && sub.combinedDataSubSubList.length >=1 ">
                    <ul v-for="top in sub.combinedDataSubSubList" :key="top.commonId">
                      <li style="font-size: 100%;" class="mt-2">{{ top.title }}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <v-card class="carousel-wrapper" style="height: 400px; width: 500px;" elevation="10">
          <v-carousel class="sub-carousel" height="400" width="500" hide-delimiters cover :show-arrows="false" cycle
            interval="3000" hide-delimiter-background="true" :touch="true" style="">
            <v-carousel-item @click="openDialog(image.furl)" v-for="image in topic.imgDataList" :key="image.furl"
              class="sub-carousel "><v-img :src="image.furl" contain height="400" class="image-box" cover></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="650">
      <v-img :src="selectedImage" contain></v-img>
    </v-dialog>
  </div>
</template>

<script>



export default {
  
  data(){
    return {
      dialog: false,
      selectedImage: null,
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2
    }
  },
  
  computed: {
    mainTopics() {
      return this.$store.getters.getMainData;
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
      // if (topic.combinedDataSubSubList && topic.combinedDataSubSubList.length > 0) {
        this.$store.commit('setFirstSub', topic);
        console.log(this.$store.getters.getFirstSub)
        this.$router.push({name:'subPage'});
      // }
      // else return;
    },
    goToSub2(topic, event) { 
      event.stopPropagation();
      // if (topic.combinedDataSubSubList && topic.combinedDataSubSubList.length > 0) {
        this.$store.commit('setSecondSub', topic);
        this.$router.push({ name: 'sub2Page' });
      // }
      // else return;
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
}
</script>
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

.home-btn{
  background-color: #FFB4AB;
  color: #690005;
}
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
  left: 80%;
  top: 17%;
  width: 50%;
  aspect-ratio: 271 / 200;

}
.image-box{
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  border: 2px solid rgb(247, 236, 194);
  object-position: center;
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
/* :deep(pre){
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
} */
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
</style>