<template>
    <div>
      <div class="topic-list d-flex flex-column justify-content-center" v-for="topic in mainTopics" :key="topic.uId">
        <div class="d-flex justify-content-center align-items-start">
          <h1 style="color: white; font-size: 200%;" class="text-center text-wrap my-4">{{topic.title}}</h1>
        </div>

        <div class=" card mx-auto">
          <div class="main-card p-4">
            <p class="text-wrap  text-justify px-5 mt-5" v-html="topic.description"></p>
            <div v-if="topic.combinedDataSubList && topic.combinedDataSubList.length >=1 " class="px-5">
              <ol v-for="sub in topic.combinedDataSubList" :key="sub.commonId">
                <li @click="goToSub(sub)" class="subtopics">{{ sub.title }}
                  <div v-if="sub.combinedDataSubSubList && sub.combinedDataSubSubList.length >=1 ">
                    <ul v-for="top in sub.combinedDataSubSubList" :key="top.commonId">
                      <li style="font-size: 100%;">{{ top.title }}</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
          </div>
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
  /* background-image: linear-gradient(to bottom right, #110b03, #3e7132); */
  background-color: #2e2c0f;
  font-family: Arial, sans-serif;
  color: #ffffff;
  padding-inline: 20px;
  overflow-x: hidden;
}
.home-btn{
  background-color: #FFB4AB;
  color: #690005;
}
.card{
  width: 90%;
  background-color: transparent;
  border: none;
}
.main-card {
  border-radius: 24px;
  width:100%;
  /* aspect-ratio: 1676 / 800; */
  height: 80vh;
  /* background-color: #363A33; */
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
  /* font-family:Arial, Helvetica, sans-serif; */
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
  text-decoration: underline;
  cursor: pointer;
}
</style>