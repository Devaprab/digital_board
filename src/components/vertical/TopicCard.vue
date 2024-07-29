<template>
  <v-card v-for="topic in Topics" :key="topic.uId" class="image-container" :style="{
    'background-image': `radial-gradient(circle at center center, rgba(28,27,27, 0.78),rgba(0,0,0, 0.69)), ${getBackgroundImage(topic)}`
    }">
    <div v-if="topic" class="image-details" @click="goToTopic(topic[0].commonId)">
      <h1 class="image-title">{{ topic[0].title }}</h1>
      <v-divider class="divider"></v-divider>
      <div class="description-container">
        <p v-html="topic[0].description"></p>
      </div>
    </div>
    <div @click="goToTopic(topic[0].commonId)" class="d-flex scrollright-container justify-content-end ">
      <p class="read-more mt-3 me-4" style="font-size: 18px;">Read More...</p>
      <div class="scrollright-btn1">
        <v-icon class="first-arrow" size="40">mdi-chevron-right</v-icon>
        <v-icon class="second-arrow" size="40">mdi-chevron-right</v-icon>
        <v-icon class="third-arrow" size="40">mdi-chevron-right</v-icon>
        <v-icon class="fourth-arrow" size="40">mdi-chevron-right</v-icon>
      </div>
    </div>

  </v-card>
</template>

<script>
import defaultImg from '@/assets/ancient.jpg';
export default {
  data() {
    return {
      
    };
  },
  props: {
    Topics: {
      type: Array,
      required: true,
      default: () => [] // Default to an empty array if no topics are passed
    }
  },
  computed: {
    language() {
      return this.$store.getters.getLanguage;
    }
  },
  
  methods: {
    getBackgroundImage(topic) {
      console.log('gfgfg', topic[0].backgroundImgList)
      // const defaultImg = require('@/assets/ancient.jpg');
      if (topic[0].backgroundImgList && topic[0].backgroundImgList.length > 0) {
        const backgroundImage = topic[0].backgroundImgList[0].bgUrl || '';
        return `url(${backgroundImage})`;
      }
      return `url(${defaultImg})`;
    },
    async goToTopic(item) {
    const payload = {
          language: this.language,
          item: item
        }
        try {
          const response = await this.$store.dispatch('getMainDetails', payload)

        if (response) {
          this.$router.push({name:'detailsPage-portrait'})
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
      },
  }
}
</script>

<style scoped>

.image-container {
  background-size: cover;
  /* width: 100%; */
  /* aspect-ratio: 1948 / 500; */
  border-radius: 20px;
  margin-bottom: 5%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
}
.image-details {
  font-weight: 400;
  cursor: pointer;
  /* width: 85%; */
  /* height: 150px; */
}
.image-title {
  font-size: 120%;
  font-weight: 600;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #f5f1e9;
}
.divider{
  color: #f5f1e9;
}
.description-container {
  overflow: hidden;
  height: 100px;
  width:80%;
  color: #f8f8f0;
}
.description-container p{
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  line-height: 26px;
}
.image-description {
  font-size: 50%;
  line-height: 1.4;
  color: white;
  width: 500px;
}
.read-more{
  color: white ;
}
.scrollright-container {
  background: transparent;
  position: absolute;
  bottom: 5%;
  right: 0;
  transform: translateX(-50%);
  cursor: pointer;
}
.scrollright-btn {
  width: 100px;
  height: 50px;
  position: absolute;
  left: 125%;
  top: 32%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.v-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
}
.first-arrow {
  animation: scrollanim 1s ease-in-out infinite;
  animation-delay: 0.8s;
}
.second-arrow {
  animation: scrollanim 1s ease-in-out infinite;
  animation-delay: 0.6s;
}
.third-arrow {
  animation: scrollanim 1s ease-in-out infinite;
  animation-delay: 0.4s;
}
.fourth-arrow {
  animation: scrollanim 1s ease-in-out infinite;
  animation-delay: 0.2s;
}
@keyframes scrollanim {
  0% {
    transform: translateY(-50%) translateX(-40px);
    opacity: 0;
  }
  60% {
    transform: translateY(-50%) translateX(0);
    opacity: 0.8;
  }
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
 @keyframes shine {
   to {
     background-position: 200% center;
   }
 }
 @media only screen and (orientation: landscape) {
   .image-container {
     height: 500px;
     width: 100%;
     position: relative;
     padding: 20px;
     padding-top: 0;
     margin-bottom: 0;
   }
   .image-details {
    /* position: absolute; */
    /* left: 7%; */
    height: 70%;
    padding-inline: 2%;
   }
   .description-container {
     height: 78%;
     width: 100%;
   }
   /* .description-container p {
     margin-top: 5px;
   } */
   .image-title {
     text-align: center;
   }
 }
 @media only screen and (orientation: portrait) {
  .image-container {
      height: 300px;
      width: 100%;
      padding: 10px;
      padding-top: 0;
    }
    .image-title{
      text-align: center;
    }
         .image-details {
           /* position: absolute;
        left: 7%;
        top: 5%; */
           height: 70%;
           padding-inline: 2%;
           
         }
  .description-container {
      height:70%;
      width: 90%;
      
    }
    /* :deep(.description-container p){
      display: -webkit-box;
        -webkit-line-clamp: 5;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
    } */
     .translate-card{
      margin-bottom: 20px;
     }  
 }
</style>
