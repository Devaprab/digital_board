<template>
  <v-main>
    <div class="topic-list">
      <!-- Topic title -->
      <div class="title">
        <h1 class="text-center text-wrap title-h1">{{ topic.title }}</h1>
      </div>
      <!-- Card with topic description & image -->
      <div class=" card mb-3" :style="cardPortrait"
        v-if="((topic.description && Array.from(topic.description).length > 60))">
        <div class="main-card ps-1 py-1" :style="[backgroundImageStyle, mainCardHeight]">
          <div class="d-flex justify-content-center arrow-up py-3">
            <v-icon color="darkgray" style="z-index: 100;" v-if="!isScrolledToTop || isScrolledToBottom"
              class="mdi mdi-chevron-double-up scroll-up" @click="scrollToTop" :style="scrollStyle"></v-icon>
          </div>
          <div class="empty-image" :style="dynamicStyle"></div>
          <!-- Description -->
          <div class=" full-desc" @scroll="handleScroll" :style="portraitHeight">
            <p class=" text-wrap text-start description" v-html="formattedDescription(topic.description)"></p>
          </div>
          <div class="d-flex justify-content-center arrow-down py-3">
            <v-icon color="darkgray" style="z-index: 100;" class="mdi mdi-chevron-double-down scroll-down"
              v-if="(isScrolledToTop || !isScrolledToBottom) && hasScroll()" @click="scrollToBottom"></v-icon>
          </div>
        </div>
        <!-- Image carousel -->
        <v-card class="carousel-wrapper bg-brown-lighten-5" elevation="10"
          v-if="topic.imgData2List && topic.imgData2List.length > 0">
          <v-carousel class="sub-carousel" hide-delimiters cover :show-arrows="false" cycle interval="6000"
            :touch="true" style="" height="100%">
            <v-carousel-item @click="openDialog(index)" v-for="(image, index) in topic.imgData2List" :key="image.furl"
              class="sub-carousel image-box " :src="image.furl" lazy-src="image.furl">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
              </template>
            </v-carousel-item>
          </v-carousel>
          <!-- Image with description dialog box -->
          <v-dialog v-model="dialog" max-width="100%" class="bg-grey-darken-4" height="100%">
            <v-container class="d-flex justify-content-center align-items-center flex-column h-100">
              <v-carousel :hide-delimiters="!(topic.imgData2List && topic.imgData2List.length > 1)" class="carousel"
                :show-arrows="false" height="100vh" width="100%">
                <v-carousel-item v-for="(image, index) in reorderedImages" :key="index">
                  <v-container class="d-flex justify-content-center align-items-center flex-column flex-grow-0"
                    style="height: 100vh;">
                    <v-card-text class="d-flex justify-content-end p-0 w-100 flex-grow-0">
                      <v-icon class="mdi mdi-close close-icon d-flex" @click="dialog = false;"></v-icon>
                    </v-card-text>
                    <v-img :src="image.furl" :lazy-src="image.furl" :alt="image.description ?? 'no image'" contain
                      height="50vh" width="100vw">
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                      </template></v-img>
                    <v-card-text class="text-center my-2 imgdesc">{{ image.description ?? '' }}</v-card-text>
                  </v-container>
                </v-carousel-item>
              </v-carousel>
            </v-container>
          </v-dialog>
        </v-card>
      </div>
      <!-- Only image is present -->
      <div v-else class="mx-auto">
        <v-card class="bg-transparent" elevation="10" v-if="topic.imgData2List && topic.imgData2List.length > 0"
          height="80vh" width="100vh">
          <v-carousel class="sub-carousel" hide-delimiters cover :show-arrows="false" cycle interval="6000"
            :touch="true" style="" height="100%" width="100%">
            <v-carousel-item v-for="(image) in topic.imgData2List" :key="image.furl" class="sub-carousel image-box ">
              <v-container class="d-flex justify-content-center align-items-center flex-column flex-grow-0"
                style="height: 100vh;">
                <v-img :src="image.furl" :lazy-src="image.furl" :alt="image.description ?? 'no image'" contain
                  height="50vh" width="100vw">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                  </template></v-img>
                <v-card-text class="text-center mt-1 imgdesc">{{ image.description ?? '' }}</v-card-text>
              </v-container>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </div>
      <!-- Bottom navigation -->
      <div class="nav mb-3">
        <div class="group1 d-flex gap-3">
          <v-btn icon="mdi mdi-arrow-left" variant="outlined" elevation="10" class="home-btn" @click="goToPrev"></v-btn>
          <v-btn icon="mdi mdi-home" variant="outlined" elevation="10" class="home-btn" @click="goHome"></v-btn>
        </div>
        <!--Showing other subheadings  -->
        <div v-if="!subView">
          <v-sheet class="subTitle bg-transparent" max-width="1100" v-if="subTitle && subTitle.length > 0">
            <v-slide-group>
              <v-slide-group-item v-for="(sub) in this.subTitle.filter(sub => sub.title !== this.topic.title)"
                :key="sub.commonId" v-slot="{ isSelected  }">
                <v-btn class="ma-2" variant="outlined" elevation="10" :color="isSelected ? '#5D4037' : undefined"
                  @click="goToSubFirst(sub.commonId)">{{ sub.title }}</v-btn>
              </v-slide-group-item>
            </v-slide-group>
          </v-sheet>
        </div>
        <!-- Translate -->
        <div class="group2 d-flex gap-3">
          <!-- showing other subheadings portrait  -->
          <div v-if="subView">
            <v-speed-dial location="left top" transition="fade-transition" scrim="black"
              v-if="subTitle && subTitle.length > 1">
              <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" size="default" icon="mdi-chevron-triple-right" class="subs"
                  variant="outlined" color="#5D4037" elevation="10"></v-fab>
              </template>
              <div v-for="(sub, index) in subTitle.filter(sub => sub.title !== topic.title)" :key="sub.commonId">
                <v-btn :key="index + 1" variant="elevated" color="#EFEBE9" width="450" height="50"
                  class="text-capitalize" rounded @click="goToSubFirst(sub.commonId)"><v-icon
                    class="mdi mdi-chevron-double-right arrow me-2 my-0" size="22"></v-icon>{{ sub.title }}</v-btn>
              </div>
            </v-speed-dial>
          </div>
          <v-card class="translate-btn text-capitalize p-2 rounded-5" elevation="10" @click="translate">
            <svg width="30" height="30" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg"
              class="svg-icon">
              <g opacity="1">
                <path fill-rule="evenodd" clip-rule="evenodd" class="svg-path" :d="path1" fill="#5D4037" />
                <path class="svg-path" :d="path2" fill="#5D4037" />
              </g>
            </svg>
          </v-card>
        </div>
      </div>
    </div>
  </v-main>
</template>

<script>
import defaultImg from '@/assets/ancient.jpg';
export default ({
  data() {
    return {
      dialog: false,
      currentSlide: 0,
      selImgArray: [],
      selectedImage: null,
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2,
      isScrolledToBottom: false,
      isScrolledToTop: true,
      translateDisabled: false
    }
  },
  computed: {
    topic() {
      return this.$store.getters.getSecondSub;
    },
    language() {
      return this.$store.getters.getLanguage;
    },
    subTitle() {
      return this.$store.getters.getFirstSubTitle;
    },
    subView() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return true;
      }
      else {
        return false;
      }
    },
    dynamicStyle() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '200px' : '50px'
        }
      } return {};
    },
    portraitHeight() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '54vh' : '76vh',
          marginTop: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '8%' : '0.5%'
        };
      }
      return {};
    },
    cardPortrait() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          bottom: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '2%' : '5%'
        };
      }
      return {
        width: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '80%' : '90%',
        marginInline: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '0' : 'auto'
      };
    },
    backgroundImageStyle() {
      return {
        'background-image': `radial-gradient(circle at center center, rgba(28,27,27, 0.78), rgba(0,0,0, 0.69)), ${this.getBackgroundImage(this.topic)}`
      };
    },
    mainCardHeight() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '75vh' : '85vh'
        };
      }
      return {
        borderRadius: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '0px 30px 30px 0px' : '30px',
      };
    },
    scrollStyle() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          position: 'absolute',
          top: this.topic.imgData2List && this.topic.imgData2List.length > 0 ? '1' : '-630%'
        };
      }
      return {}
    }
  },
  async mounted() {
    this.goToTopic();
    try {
     await this.$store.dispatch('getSubTitle',{id:this.topic.fsCommonId,language: this.language}); 
    }
    catch (error) {
      console.error(error)
    }
  },
  methods: {
    async goToSubFirst(topic) {
      try {
        await this.$store.dispatch('getSub2Details', {id:topic, language: this.language});
      }
      catch (error) {
        console.error(error)
      }
    },
    async goToPrev() {
      this.$router.back();
    },
    goHome() {
      this.$router.push('/digitalBoard/detailsPage');
    },
    getBackgroundImage(topic) {
      if (topic.backgroundImgList && topic.backgroundImgList.length > 0) {
        const backgroundImage = topic.backgroundImgList[0].bgUrl || '';
        return `url(${backgroundImage})`;
      }
      return `url(${defaultImg})`;
    },
    openDialog(index) {
      const imgData2List = this.topic.imgData2List
      this.reorderedImages = [
        ...imgData2List.slice(index),
        ...imgData2List.slice(0, index)
      ];
      this.dialog = true;
    },
    extractName(fname) {
      const nameParts = fname.split('_').slice(1);
      return nameParts.join(' ').replace(/\.[^/.]+$/, '');
    },
    async translate() {
      if (this.language == 1) {
        this.$store.commit('setLanguage', 2);
      } else {
        this.$store.commit('setLanguage', 1);
      }
      try {
        const res1 = this.goToTopic();
        const res2 = await this.$store.dispatch('getSubTitle', { id: this.topic.fsCommonId, language: this.language });
        if (res1 && res2) {
          this.translateDisabled = false
        }
      }
      catch (error) {
        console.error(error)
      }
    },
    formattedDescription(description) {
      if (description) {
        return description.replace(/\n/g, '<br>');
      }
      else return '';
    },
    async goToTopic() {
      try {
        await this.$store.dispatch('getSub2Details', { language: this.language, id: this.topic.ssCommonId })
      }
      catch (error) {
        console.error(error);
      }
    },
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
      this.isScrolledToBottom = fullDescElement.scrollHeight <= fullDescElement.clientHeight + fullDescElement.scrollTop + 0.9;
      this.isScrolledToTop = fullDescElement.scrollTop === 0;
    },
    hasScroll() {
      const fullDescElement = document.querySelector('.full-desc');
      if (fullDescElement) {
        return fullDescElement.scrollHeight > fullDescElement.clientHeight;
      } else {
        return false;
      }
    },
  }
})
</script>
<style scoped>
@keyframes scaleUpDown {
  0%,100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
@keyframes slide {
  0%,100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(7px, 0);
  }
}
@keyframes slide2 {
  0%,100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(5px, 0);
  }
}
@keyframes slideY {
  0%,100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 5px);
  }
}
.topic-list {
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
.imgdesc {
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
}
:deep(.v-carousel__controls__item .v-icon) {
  opacity: 0.7;
}

:deep(.v-carousel__controls) {
  background: transparent;
}

:deep(.v-carousel .v-btn--icon.v-btn--density-default) {
  width: 8px;
  height: 12px;
}

:deep(.v-carousel__controls__item.v-btn--active) {
  opacity: 1;
  color: #4d3d29;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-h1 {
  color: #1c1405;
  font-size: 200%;
  font-weight: 700;
}
.card {
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
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-inline: 5px;
}
.arrow {
  animation: slide 1s ease-in-out infinite;
  margin-left: 9px;
}
.arrow2 {
  animation: slide2 1s ease-in-out infinite;
  margin-left: 1px;
}
.arrow-down,
.arrow-up {
  animation: slideY 2s ease-in-out infinite;
  animation-delay: .2s;
}
::-webkit-scrollbar {
  display: none;
}
:deep(.carousel .v-btn) {
  background-color: none;
}
@media only screen and (orientation: portrait) {
  .topic-list {
    justify-content: center;
    position: relative;
  }
  .title h1 {
    margin-top: 2%;
    margin-bottom: 2%;
    position: absolute;
    top: 2%;
  }
  .card {
    margin-inline: auto;
    width: 80%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .main-card {
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
  :deep(.description),
  .list {
    font-size: 110%;
    padding-left: 25px;
  }
  .full-desc {
    width: 90%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .arrow-down {
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
  .card {
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
    height: 70%
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
  :deep(.description) {
    font-size: 110%;
  }
  .full-desc {
    width: 85%;
    height: 80%;
    overflow-x: hidden;
    padding-inline: 50px;
    overflow-y: scroll;
  }
  .nav {
    margin-inline: 45px;
    padding-right: 10px;
  }
}
</style>