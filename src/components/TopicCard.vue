<template>
  <v-card v-for="topic in Topics" :key="topic.uId"
    class="image-container d-flex flex-column" :style="{'background-image': `linear-gradient(to right, rgba(0, 0, 0, 0.982), rgba(37, 37, 37, 0.253)), ${getBackgroundImage(topic)}`
    }" elevation="24">
    <div v-if="topic" class="image-details">
      <h1 class="image-title">{{ topic[0].title }}</h1>
      <div class="description-container text-white">
        <p v-html="topic[0].description"></p>
      </div>

    </div>

    <div @click="goToTopic(topic[0].commonId)" class="d-flex scrollright-container">
      <p class="text-white read-more" style="font-size: 18px;" >Read More...</p>
        <div class="scrollright-btn">
          <v-icon class="first-arrow" size="40">mdi-chevron-right</v-icon>
          <v-icon class="second-arrow" size="40">mdi-chevron-right</v-icon>
          <v-icon class="third-arrow" size="40">mdi-chevron-right</v-icon>
          <v-icon class="fourth-arrow" size="40">mdi-chevron-right</v-icon>
        </div>
    </div>

  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isTruncated: false, // Initially, text is not truncated
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
  mounted() {
    this.isTruncated = !this.isTruncated;
    console.log(this.isTruncated + " truncated");
  },
  methods: {
    getBackgroundImage(topic) {
      const defaultImg = require('@/assets/ancient.jpg');
      if (topic.imgDataList && topic.imgDataList.length > 0) {
        const backgroundImage = topic.imgDataList[0].furl || '';
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
          this.$router.push({name:'detailsPage'})
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
  width: 100%;
  aspect-ratio: 1948 / 800;
  border-radius: 20px;
  margin-bottom: 5%;
  position: relative;
}
.image-details {
  font-weight: 400;
  width: 85%;
  /* height: 200px; */
  position:absolute;
  bottom:20%;
  aspect-ratio: auto;
  left:7%;
}

.image-title {
  font-size: 40px;
  font-weight: 600;
  line-height: 40px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
}

.description-container {
  overflow: hidden;
  /* height: 180px; */
  width:80%;
  
}
.description-container p{
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  /* font-size: 20px; */
  line-height: 32px;
}
.image-description {
  font-size: 20px;
  line-height: 1.4;
  color: white;
  width: 500px;
}

:deep(pre) {
  text-wrap: wrap;
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: auto;
  max-height: 180px;
  padding-right: 5px;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: justify;
  font-size: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.scrollright-container {
  background: transparent;
  position: absolute;
  left:7.5%;
  bottom: 8%;
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
/* .read-more {
  animation: scaleUpDown 1.5s infinite;
} */
</style>
