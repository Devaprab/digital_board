<template>
  <v-main>
    <div class="topic-list">
      <!-- Topic title -->
      <div class="title">
        <h1 class="text-center text-wrap title-h1 mt-2">{{ topic.title }}</h1>
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
          <div ref="fulldesc" class=" full-desc" @scroll="handleScroll" :style="portraitHeight">
            <p class=" text-wrap text-start description" v-html="formattedDescription(topic.description)"></p>
          </div>
          <div class="d-flex justify-content-center arrow-down py-3">
            <v-icon color="darkgray" style="z-index: 100;" class="mdi mdi-chevron-double-down scroll-down"
              v-if="(isScrolledToTop || !isScrolledToBottom) && hasScroll()" @click="scrollToBottom"></v-icon>
          </div>
        </div>
        <!-- Image carousel -->
        <v-card class="carousel-wrapper bg-brown-lighten-5" elevation="10"
          v-if="carouselItems && carouselItems.length > 0">
          <v-carousel class="sub-carousel" hide-delimiters cover :show-arrows="false" cycle interval="9000"
            :touch="true" style="" height="100%">
            <v-carousel-item v-for="(item, index) in carouselItems" :key="item.furl" @click="openDialog(index)"
              class="sub-carousel image-box">
              <template v-if="item.type === 'image'">
                <v-img :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`" alt="Image"
                  style="width: 100%; height: 100%; object-fit: cover;">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </template>
              <template v-else-if="item.type === 'video'">
                <div class="p-0 bg-transparent d-flex align-items-center justify-content-center flex-column">
                  <v-overlay v-model="videoOverlay" class="align-center justify-center" contained>
                    <v-btn variant="text" size="100">
                      <v-icon class="mdi mdi-play-circle-outline" size="100" color="#EFEBE9"></v-icon>
                    </v-btn>
                  </v-overlay>
                  <video :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`" autoplay></video>
                </div>
              </template>
              <!-- <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
              </template> -->
            </v-carousel-item>
          </v-carousel>
          <!-- Image with description dialog box -->
          <v-dialog v-model="dialog" max-width="100%" class="bg-grey-darken-4" height="100%">
            <v-container class="d-flex justify-content-center align-items-center flex-column h-100 bg-white">
              <v-carousel :hide-delimiters="!(carouselItems && carouselItems.length > 1)" class="carousel p-0"
                :show-arrows="false" height="100vh" width="100%">
                <v-carousel-item v-for="(item, index) in reorderedImages" :key="index" class="p-0">
                  <v-container class="d-flex justify-content-center align-items-center flex-column flex-grow-0">
                    <v-card-text class="d-flex justify-content-end p-0 w-100 flex-grow-0">
                      <v-icon class="mdi mdi-close close-icon d-flex close" @click="dialog = false;"
                        color="black"></v-icon>
                    </v-card-text>
                    <!-- Conditional rendering based on the item type -->
                    <template v-if="item.type === 'image'">
                      <h5 class="text-center">{{ item.name ?? ' ' }}</h5>
                      <v-img :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`" :alt="item.description ?? 'no image'" contain
                        height="60vh" width="100vw">
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                      <v-card-text class="text-center my-2 imgdesc text-caption fst-italic text-break px-2"
                        style="line-height: 15px;">{{
                        item.description ?? '' }}</v-card-text>
                    </template>
                    <template v-else-if="item.type === 'video'">
                      <video :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`" controls autoplay
                        style="width:100%; object-fit: contain;" @ended="dialog = false;">
                        Your browser does not support the video tag.
                      </video>
                    </template>
                  </v-container>
                </v-carousel-item>
              </v-carousel>
            </v-container>
          </v-dialog>
        </v-card>
      </div>
      <!-- Only image is present-->
      <div v-else class="mx-auto image-card">
        <div v-if="(topic.mp4Data2List?.length < 2) && (topic.imgData2List?.length > 0)">
          <v-card class="bg-transparent" flat v-if="carouselItems && carouselItems.length > 0" :height="dynamicHeight"
            :width="dynamicWidth">
            <v-carousel class="sub-carousel" :hide-delimiters="carouselItems && carouselItems.length <= 1" cover
              :show-arrows="false" :touch="true" style="" height="100%" width="100%" cycle interval="9000">
              <v-carousel-item v-for="(item) in carouselItems" :key="item.furl" class="sub-carousel">
                <v-container class="d-flex justify-content-center align-items-center flex-column flex-grow-0"
                  style="height: 100vh;">
                  <template v-if="item.type === 'image'">
                    <v-img :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`" :alt="item.description ?? 'no image'" contain
                      height="50vh" width="100vw">
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </template>
                  <template v-else-if="item.type === 'video'">
                    <video :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`" controls autoplay loop
                      style=" height:100vh; width:100%; object-fit: cover;">
                    </video>
                  </template>
                  <v-card-text class="text-center imgdesc pb-0 pt-1 px-2" style="line-height: 15px;">{{
                    item.description?? '' }}</v-card-text>
                </v-container>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </div>
        <!-- video content -->
        <v-card flat v-else-if="topic.mp4Data2List?.length > 1"
          class="d-flex flex-wrap bg-transparent justify-content-start align-items-center video-cards gap-4 mt-3"
          :class="videoCard" :height="dynamicHeight" :width="dynamicWidth">
          <div v-for="video in topic.mp4Data2List" :key="video.furl"
            class="d-flex justify-content-center align-items-center flex-column">
            <v-card elevation="5" width="200" height="auto"
              class="p-0 bg-transparent d-flex align-items-center justify-content-center border-card flex-column">
              <v-overlay v-model="overlayvideo" class="align-center justify-center" contained>
                <v-btn variant="text" size="50" @click="selectVideo(video)">
                  <v-icon class="mdi mdi-play-circle-outline" size="50" color="#EFEBE9"></v-icon>
                </v-btn>
              </v-overlay>
              <video :src="`${mediaUrl}/${video.fname}`" :lazy-src="`${mediaUrl}/${video.fname}`"
                style=" height:120px; width:250px; object-fit: contain;"></video>
            </v-card>
            <v-card-text class="text-center p-0 py-3 text-wrap">{{ video.name }}</v-card-text>
          </div>
        </v-card>
        <!-- only video present without images -->
        <v-card flat v-else-if="topic.mp4Data2List?.length === 1" class="bg-transparent" height="80vh">
          <div v-for="video in topic.mp4Data2List" :key="video.furl" class="mx-auto">
            <v-card class="bg-transparent" flat :height="dynamicHeight" :width="dynamicWidth">
              <video :src="`${mediaUrl}/${video.fname}`" :lazy-src="`${mediaUrl}/${video.fname}`" style=" height:100%; width:100%; object-fit: contain;"
                autoplay controls loop></video>
            </v-card>
            <v-card-text class="text-center p-0 py-4">{{ video.name }}</v-card-text>
          </div>
        </v-card>
        <!-- dialog to show video content -->
        <v-dialog v-model="videoShow" max-width="100%" class="bg-grey-darken-4" height="100%">
          <video :src="`${mediaUrl}/${selectVideo.fname}`" :lazy-src="`${mediaUrl}/${selectVideo.fname}`" controls autoplay
            style="height: 100%; object-fit: contain;" class="dialog-video" @ended="videoShow = false;">
          </video>
          <div class="d-flex justify-content-end">
            <v-icon class="mdi mdi-close close-video" color="white" @click="videoShow = false;"></v-icon>
          </div>
        </v-dialog>
      </div>
      <!-- Bottom navigation -->
      <div class="nav mb-3">
        <div class="group1 d-flex gap-3">
          <v-btn icon="mdi mdi-arrow-left" variant="outlined" elevation="10" class="home-btn" @click="goToPrev"></v-btn>
          <v-btn icon="mdi mdi-home" variant="outlined" elevation="10" class="home-btn" @click="goHome"
            v-if="$store.getters.getSelectedTopics.length > 1"></v-btn>
        </div>
        <!--Showing other subheadings  -->
        <div v-if="!subView">
          <v-sheet class="subTitle bg-transparent" max-width="900" v-if="subTitle && subTitle.length > 0">
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
            <v-btn icon="mdi-chevron-triple-right" variant="outlined" color="#5D4037" elevation="10"
              v-if="subTitle && subTitle.length > 1" @click="showSubView" class="translate-btn"></v-btn>
            <v-overlay v-model="overlay" location-strategy="connected" class="align-center justify-end"
              style="padding-right: 12%; background-color: #0606067b;" @afterEnter="checkScroll"
              scroll-strategy="block">
              <div ref="subviewList"
                class="subview-list d-flex flex-column justify-content-center align-items-end gap-2">
                <div v-for="(sub, index) in subTitle.filter(sub => sub.title !== topic.title)" :key="sub.commonId">
                  <v-btn :key="index + 1" variant="elevated" color="#EFEBE9" width="250" height="fit-content"
                    style="font-size: 10px;" class="text-capitalize text-wrap" rounded="3"
                    @click="goToSubFirst(sub.commonId)"><v-icon class="mdi mdi-chevron-double-right arrow me-2 my-0"
                      size="22"></v-icon>
                    <p class="text-wrap my-1">{{ sub.title }}</p>
                  </v-btn>
                </div>
              </div>
              <!-- <div class="d-flex justify-content-center">
              <v-icon class="mdi mdi-plus" color="white" v-if="scroll"></v-icon>  
              </div> -->
              <div class="container" v-if="scroll">
                <div class="chevron"></div>
                <div class="chevron"></div>
                <div class="chevron"></div>
                <span class="text">Scroll down</span>
              </div>

            </v-overlay>
          </div>
          <v-card class="translate-btn text-capitalize p-2 rounded-5" elevation="10" @click="translate"
            :loading="translateDisabled" :disabled="translateDisabled">
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
      translateDisabled: false,
      overlay: false,
      scroll: false,
      overlayvideo: true,
      videoShow: false,
      selectedVideo: null
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
    carouselItems() {
      const images = this.topic.imgData2List.map(image => ({
        type: 'image',
        furl: image.furl,
        fname: image.fname,
        description: image.description
      }));
      const videos = this.topic.mp4Data2List.map(video => ({
        type: 'video',
        furl: video.furl,
        fname: video.fname,
        description: video.name // Adjust this based on available data
      }));
      return [...images, ...videos];
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
          height: this.carouselItems && this.carouselItems.length > 0 ? '200px' : '50px'
        }
      } return {};
    },
    dynamicHeight() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return "80vh";
      }else return "80vh";
    },
    dynamicWidth() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return "80vw";
      }else return "auto";
    },

    portraitHeight() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          height: this.carouselItems && this.carouselItems.length > 0 ? '46vh' : '66vh',
          marginTop: this.carouselItems && this.carouselItems.length > 0 ? '8%' : '5%'
        };
      }
      return {
        width: this.carouselItems && this.carouselItems.length > 0 ? '85%' : '100%'
      };
    },
    cardPortrait() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          bottom: this.carouselItems && this.carouselItems.length > 0 ? '9%' : '9%'
        };
      }
      return {
        width: this.carouselItems && this.carouselItems.length > 0 ? '80%' : '90%',
        marginInline: this.carouselItems && this.carouselItems.length > 0 ? '0' : 'auto'
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
          height: this.carouselItems && this.carouselItems.length > 0 ? '70vh' : '79vh'
        };
      }
      return {
        borderRadius: this.carouselItems && this.carouselItems.length > 0 ? '0px 30px 30px 0px' : '30px',
      };
    },
    scrollStyle() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return {
          position: 'absolute',
          top: this.carouselItems && this.carouselItems.length > 0 ? '1' : '-590%'
        };
      }
      return {}
    },
    videoCard() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        return ' ';
      } else
        return 'flex-column'
    }
  },
  async mounted() {
    // console.log('image',this.carouselItems);
    this.goToTopic();
    try {
     await this.$store.dispatch('getSubTitle',{id:this.topic.fsCommonId,language: this.language}); 
    }
    catch (error) {
      console.error(error)
    }
  },
  methods: {
    checkScroll() {
      const element = this.$refs.subviewList;
      this.scroll = element.scrollHeight > element.clientHeight;
      console.log('list', this.scroll)
    },
    selectVideo(video) {
      this.selectedVideo = video;
      this.videoShow = true;
    },
    showSubView() {
      this.overlay = true;
    },
    async goToSubFirst(topic) {
      try {
        const res = await this.$store.dispatch('getSub2Details', { id: topic, language: this.language });
        if (res) {
          this.overlay = false;
        }
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
        const backgroundImage = `${this.mediaUrl}/${topic.backgroundImgList[0].bgName}` || '';
        return `url(${backgroundImage})`;
      }
      return `url(${defaultImg})`;
    },
    // openDialog(index) {
    //   const imgData2List = this.topic.imgData2List
    //   this.reorderedImages = [
    //     ...imgData2List.slice(index),
    //     ...imgData2List.slice(0, index)
    //   ];
    //   this.dialog = true;
    // },
    openDialog(index) {
    const imgDataList = this.topic.imgData2List.map(image => ({
      type: 'image',
      furl: image.furl,
      fname: image.fname,
      description: image.description || '', // Add description if available
      name: image.name
    }));
console.log('image',imgDataList);
    const mp4DataList = this.topic.mp4Data2List.map(video => ({
      type: 'video',
      furl: video.furl,
      fname: video.fname,
      description: video.name || '' // Add description if available
    }));
    const combinedList = [...imgDataList, ...mp4DataList];
    this.reorderedImages = [
      ...combinedList.slice(index),
      ...combinedList.slice(0, index)
    ];

    this.dialog = true;
  },
    async translate() {
      if (this.language == 1) {
        this.$store.commit('setLanguage', 2);
      } else {
        this.$store.commit('setLanguage', 1);
      }
      try {
        this.translateDisabled = true;
        const res1 = this.goToTopic();
        const res2 = await this.$store.dispatch('getSubTitle', { id: this.topic.fsCommonId, language: this.language });
        if (res1 && res2) {
          this.translateDisabled = false;
        }
      }
      catch (error) {
        this.translateDisabled = false
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
.border-card{
  border: 2px solid cornsilk;
}
:deep(.v-fab__container){
  position: static;
  border-radius: 50%;
  /* border: 2px solid brown; */
  animation: scaleUpDown 2s ease-in-out infinite;
  animation-delay: 0.8s;
  /* background-color: transparent; */
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
  /* font-size: 16px; */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 400;
}
:deep(.v-carousel__controls__item .v-icon) {
  opacity: 0.7;
}

:deep(.v-carousel__controls) {
  background: transparent;
}

/* :deep(.v-carousel .v-btn--icon.v-btn--density-default) {
  width: 8px;
  height: 12px;
} */
:deep(.v-carousel__controls__item .v-btn__content i) {
  color: rgb(168, 159, 120);
}

:deep(.v-carousel__controls__item.v-btn--active .v-btn__content i) {
  color: #060606;
  opacity: 1;
}
:deep(.v-carousel .v-btn--icon.v-btn--density-default) {
  width: 1px;
  height: 0.5px;
}

:deep(.v-carousel__controls__item.v-btn--active) {
  opacity: 1;
  color: #0c0c0b;
}

:deep(.carousel .mdi:before), :deep(.sub-carousel .mdi:before) {
  font-size: 10px;
}

:deep(.close.mdi:before) {
  font-size: 20px;
  width: 5px;
  /* height: 10px; */
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
  /* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */
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
  .subview-list {
      height: auto;
      max-height: 500px;
      width: 250px;
      overflow-y: auto;
    }
    .video-cards{
      overflow-x: hidden;
      overflow-y: auto;
    }
  :deep(.v-speed-dial__content){
    gap: 2px;
  }
  .topic-list {
    justify-content: center;
    position: relative;
  }
  .title{
    display: flex;
    justify-content: center;
  }
  .title h1 {
    margin-top: 3%;
    margin-bottom: 2%;
    position: absolute;
    top: 2%;
    padding-inline: 10px;
  }
  .image-card {
    margin-inline: auto;
    width: 80%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
    top: -15%;
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
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
  }
  .arrow-up {
    position: absolute;
    top: 17%;
    left: 50%;
    transform: translateX(-50%);
  }
  .group1, .group2{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
    .container {
      position: relative;
      width: 24px;
      height: 24px;
    }
  
    .chevron {
      position: absolute;
      width: 28px;
      height: 2px;
      opacity: 0;
      transform: scale3d(0.5, 0.5, 0.5);
      animation: move 3s ease-out infinite;
    }
  
    .chevron:first-child {
      animation: move 3s ease-out 1s infinite;
    }
  
    .chevron:nth-child(2) {
      animation: move 3s ease-out 2s infinite;
    }
  
    .chevron:before,
    .chevron:after {
      content: ' ';
      position: absolute;
      top: 0;
      height: 100%;
      width: 51%;
      background: #fff;
    }
  
    .chevron:before {
      left: 0;
      transform: skew(0deg, 30deg);
    }
  
    .chevron:after {
      right: 0;
      width: 50%;
      transform: skew(0deg, -30deg);
    }
  
    @keyframes move {
      25% {
        opacity: 1;
  
      }
  
      33% {
        opacity: 1;
        transform: translateY(30px);
      }
  
      67% {
        opacity: 1;
        transform: translateY(40px);
      }
  
      100% {
        opacity: 0;
        transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
      }
    }
}
@media only screen and (orientation: landscape) {
  .card {
    width: 80%;
    position: relative;
  }
    .video-cards {
      overflow-x: auto;
      overflow-y: hidden;
    }
    .dialog-video{
      position: relative;
    }
    .close-video{
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 100;
    }
  :deep(.v-carousel__controls) {
    height: 30px;
  }
  .main-card {
    height: 75vh;
  }
  .carousel-wrapper {
    aspect-ratio: 813/650;
    position: absolute;
    left: 84%;
    top: 15%;
    width: 38%;
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