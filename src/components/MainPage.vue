<template>
  <v-main>
    <div class="topic-list" v-for="topic in mainTopics" :key="topic.uId">
      <!-- Topic title -->
      <div class="title">
        <h1 class="text-center text-wrap title-h1">
          {{ topic.title }}</h1>
      </div>
      <!-- Card with topic description & image -->
      <div class=" card mb-3" :style="cardPortrait">
        <div class="main-card ps-1 py-1" :style="[backgroundImageStyle, mainCardHeight]">
          <!-- Scroll up -->
          <div class="d-flex justify-content-center arrow-up py-3">
            <v-icon color="darkgray" style="z-index: 100;" v-if="!isScrolledToTop || isScrolledToBottom"
              class="mdi mdi-chevron-double-up scroll-up" @click="scrollToTop" :style="scrollStyle"></v-icon>
          </div>
          <div class="empty-image" :style="dynamicStyle"></div>
          <!-- Description -->
          <div class=" full-desc" @scroll="handleScroll" :style="portraitHeight">
            <p class=" text-wrap text-start description my-0" v-html="formattedDescription(topic.description)"></p>
            <!-- Subheadings -->
            <div v-if="topic.combinedDataSubList && topic.combinedDataSubList.length >= 1" class="list">
              <ul v-for="sub in topic.combinedDataSubList" :key="sub.commonId" style="z-index: 2;"
                class="list-unstyled my-0 ">
                <li @click="goToSub(sub)" class="subtopics mb-2" style="font-size: 100%;">
                  <v-icon class="mdi mdi-chevron-double-right arrow me-2 my-0" size="22"></v-icon>
                  {{ sub.title }}
                  <!-- Sub of subheadings -->
                  <div v-if="sub.combinedDataSubSubList && sub.combinedDataSubSubList.length >= 1" class="ms-5">
                    <ul v-for="top in sub.combinedDataSubSubList" :key="top.commonId" class="list-unstyled">
                      <li style="font-size: 100%;" class="mb-0 mt-1" @click="goToSub2(top, $event)">
                        <v-icon class="mdi mdi-circle-small" size="20"></v-icon>
                        {{ top.title }}
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- Scroll down -->
          <div class="d-flex justify-content-center arrow-down py-3">
            <v-icon color="darkgray" style="z-index: 100;" class="mdi mdi-chevron-double-down scroll-down"
              v-if="(isScrolledToTop || !isScrolledToBottom) && hasScroll()" @click="scrollToBottom"></v-icon>
          </div>
        </div>
        <!-- Image carousel -->
        <v-card class="carousel-wrapper bg-brown-lighten-5" elevation="10"
          v-if="topic.imgDataList && topic.imgDataList.length > 0">
          <v-carousel class="sub-carousel" hide-delimiters cover :show-arrows="false" cycle interval="6000"
            :touch="true" style="" height="100%">
            <v-carousel-item @click="openDialog(index)" v-for="(image, index) in topic.imgDataList" :key="image.furl"
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
            <v-container class="d-flex justify-content-center align-items-center flex-column bg-white h-100">
              <v-carousel :show-delimiters="topic.imgDataList && topic.imgDataList.length > 1" class="carousel"
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
                      </template>
                    </v-img>
                    <v-card-text class="text-center my-2 imgdesc">{{ image.description ?? '' }}</v-card-text>
                  </v-container>
                </v-carousel-item>
              </v-carousel>
            </v-container>
          </v-dialog>
        </v-card>
      </div>
      <!-- Bottom navigation -->
      <div class="nav mb-3">
        <v-btn icon="mdi-home" variant="outlined" elevation="10" class="home-btn"
          @click="$router.push('/digitalBoard/selectedTopics');"></v-btn>
        <!-- Translate -->
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
  </v-main>
</template>

<script>
import defaultImg from '@/assets/ancient.jpg';
export default {
  data() {
    return {
      dialog: false,
      reorderedImages: [],
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
    },
    dynamicStyle() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '200px' : '50px'
        }
      } return {};
    },
    portraitHeight() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '54vh' : '76vh',
          marginTop: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '8%' : '0.5%'
        };
      }
      return {
        width: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '85%' : '100%'
      };
    },
    cardPortrait() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          bottom: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '2%' : '5%'
        };
      }
      return {
        width: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '80%' : '90%',
        marginInline: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '0' : 'auto'
      };
    },
    backgroundImageStyle() {
      return {
        'background-image': `radial-gradient(circle at center center, rgba(28,27,27, 0.78), rgba(0,0,0, 0.69)), ${this.getBackgroundImage(this.mainTopics[0])}`
      };
    },
    mainCardHeight() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '75vh' : '85vh'
        };
      }
      return {
        borderRadius: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '0px 30px 30px 0px' : '30px',
      };
    },
    scrollStyle() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          position: 'absolute',
          top: this.mainTopics[0].imgDataList && this.mainTopics[0].imgDataList.length > 0 ? '1' : '-630%'
        };
      }
      return {}
    }
  },
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
        return false;
      }
    },
    goToSub(topic) {
      console.log('subtopics',topic)
      this.$store.commit('setFirstSub', topic);
      this.$router.push({ name: 'subPage' });
    },
    goToSub2(topic, event) {
      console.log('sub2topics', topic)
      event.stopPropagation();
      this.$store.commit('setSecondSub', topic);
      this.$router.push({ name: 'sub2Page' });
    },
    getBackgroundImage(topic) {
      if (topic.backgroundImgList && topic.backgroundImgList.length > 0) {
        const backgroundImage = topic.backgroundImgList[0].bgUrl || '';
        return `url(${backgroundImage})`;
      }
      return `url(${defaultImg})`;
    },
    openDialog(index) {
      const imgDataList = this.mainTopics[0].imgDataList
      this.reorderedImages = [
        ...imgDataList.slice(index),
        ...imgDataList.slice(0, index)
      ];
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
      await this.$store.dispatch('getMainDetails', { language: this.language, item: this.mainTopics[0].commonId })
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
  },
}
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
  opacity: 0.9;
}
:deep(.v-carousel__controls) {
  background: transparent;
}
:deep(.v-carousel .v-btn--icon.v-btn--density-default) {
  width: 8px;
  height: 12px;
}
:deep(.v-carousel__controls__item.v-btn--active) {
  opacity: 0.8;
  color: #261503;
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