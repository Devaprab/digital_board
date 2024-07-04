<template>
  <div v-for="topic in Topics" :key="topic.uId"
    class="image-container mx-auto my-5 d-flex flex-column justify-content-end ps-5 pb-5" :style="{'background-image': `linear-gradient(to right, rgba(0, 0, 0, 0.982), rgba(37, 37, 37, 0.253)), ${getBackgroundImage(topic)}`
    }" @click="goToTopic(topic[0].commonId)">
    <div v-if="topic" class="image-details ms-5 pb-5">
      <h1 class="image-title">{{ topic[0].title }}</h1>
      <div class="description-container text-white">
        <p v-html="topic[0].description"></p>
      </div>
    </div>
  </div>
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
  aspect-ratio: 1936 / 848;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
}
.image-details {
  font-weight: 400;
  width: 80%;
  height: 300px;
  aspect-ratio: 942/277;
}

.image-title {
  font-size: 45px;
  font-weight: bold;
  color: white;
}

.description-container {
  overflow: hidden;
  height: 180px;
  width:70%;
  
}
.description-container p{
  overflow: hidden;
  text-overflow: ellipsis;
word-wrap: break-word;
font-size: 100%;
line-height: 32px;
}
.image-description {
  font-size: 13px;
  line-height: 1.4;
  color: white;
  width: 500px;
}
.see-more {
    color: white;
    cursor: pointer;
    text-decoration: none;
    line-height: 32px;
}
:deep(pre) {
  text-wrap: wrap;
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: auto;
  max-height: 180px;
  padding-right: 5px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: justify;
  font-size: 16px;
  display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
}
</style>
