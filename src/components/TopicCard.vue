<template>
  <div class="image-container mx-auto my-5 d-flex flex-column justify-content-end ps-5 pb-5 bg-success">
    <div class="image-details ms-5 pb-5 " style="background-image: url(@/assets/ancient.jpg);">
      <h1 class="image-title">title </h1>
      <div class="description-container">
        <p>
          topic1.description 
        </p> 
      </div>
      <div v-if="isTruncated">
        <router-link to="/details" class="see-more">...See More</router-link>
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
  computed: {
        language() {
            return this.$store.getters.getLanguage;
        }
    },
    mounted() { 
      this.isTruncated = !this.isTruncated;
      console.log(this.isTruncated + "truncated");
       
    },
    // methods: {
    //     getBackgroundImage() { 
    //   const defaultImg = require('@/assets/ancient.jpg');  
    // //   if (mainheading && mainheading.imgDataList && mainheading.imgDataList.length > 0) {
    // //     const backgroundImage = mainheading.imgDataList[0].furl||'';
    // //     return `url(${ backgroundImage })`; 
    // //   }
    //   return `url(${defaultImg})`; 
    // }
    // }
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
  height: 200px;
  aspect-ratio: 942/277;
}

.image-title {
  font-size: 45px;
  font-weight: bold;
  /* color: white; */
}

.description-container {
  overflow: hidden;
  height: 88px;
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
  /* color: white; */
  width: 500px;
}
.see-more {
    color: white;
    cursor: pointer;
    text-decoration: none;
    line-height: 32px;
}
</style>
