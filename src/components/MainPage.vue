<template>
  <v-main>
    <div class="topic-list" v-for="topic in mainTopics" :key="topic.uId">
      <!-- Topic title -->
      <div class="title">
        <h1 
      class="text-center text-wrap title-h1 mt-2" 
      :style="{ fontSize: dynamicFontSize }"
    >
      {{ topic.title }}
    </h1>
      </div>
      <!-- Card with topic description & image -->
      <div class=" card mb-3" :style="cardPortrait"
        v-if="((topic.description && Array.from(topic.description).length > 60) || (topic.combinedDataSubList && topic.combinedDataSubList.length >= 1))">
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
            <div v-if="sortedCombinedDataSubList && sortedCombinedDataSubList.length >= 1" class="list">
              <ul v-for="sub in sortedCombinedDataSubList" :key="sub.commonId" style="z-index: 2;"
                class="list-unstyled my-0 mt-2">
                <li @click="goToSub(sub)" class="subtopics mb-2" style="font-size: 100%;">
                  <div class="d-flex">
                  <v-icon class="mdi mdi-chevron-double-right arrow me-2 my-0" size="22"></v-icon>
                  <div>{{ sub.title?.trim() || ' ' }}</div>
                </div>
                </li>
              </ul>
            </div>
            <div class="audio-element px-2" v-if="topic.mp3DataList.length > 0">
              <AudioPlayer
                :audioSrc="`${mediaUrl}/${topic.mp3DataList[0].fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`" />
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
                  <video class="video" :poster="posterUrl(item.thumbnailName)" :src="`${mediaUrl}/${item.fname}`"
                    :lazy-src="`${mediaUrl}/${item.fname}`"></video>
                </div>
              </template>
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
                      <v-img :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`"
                        :alt="item.description ?? 'no image'" contain height="60vh" width="100vw">
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                      <v-card-text class="text-center my-2 imgdesc text-caption fst-italic text-break px-2"
                        style="line-height: 15px;">{{item.description ?? ''}}</v-card-text>
                    </template>
                    <template v-else-if="item.type === 'video'">
                      <video :poster="posterUrl(item.thumbnailName)" :src="`${mediaUrl}/${item.fname}`"
                        :lazy-src="`${mediaUrl}/${item.fname}`" controls disablepictureinpicture
                        controlsList="nodownload noplaybackrate" autoplay
                        @play="this.$store.commit('setIsVideoPlaying', true);"
                        @pause="this.$store.commit('setIsVideoPlaying', false);" @contextmenu.prevent
                        style="width:100%; object-fit: contain;"
                        @ended="dialog = false; this.$store.commit('setIsVideoPlaying', false);">
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
        <div v-if="(topic.mp4DataList?.length < 2) && (topic.imgDataList?.length > 0)">
          <v-card class="bg-transparent" flat v-if="carouselItems && carouselItems.length > 0" :height="dynamicHeight"
            :width="dynamicWidth">
            <v-carousel class="sub-carousel" :hide-delimiters="carouselItems && carouselItems.length <= 1" cover
              :show-arrows="false" :touch="true" style="" height="100%" width="100%" cycle interval="9000">
              <v-carousel-item v-for="(item) in carouselItems" :key="item.furl" class="sub-carousel">
                <v-container class="d-flex justify-content-center align-items-center flex-column flex-grow-0"
                  style="height: 100vh;">
                  <template v-if="item.type === 'image'">
                    <v-img :src="`${mediaUrl}/${item.fname}`" :lazy-src="`${mediaUrl}/${item.fname}`"
                      :alt="item.description ?? 'no image'" contain height="50vh" width="100vw">
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </template>
                  <template v-else-if="item.type === 'video'">
                    <video :poster="posterUrl(item.thumbnailName)" :src="`${mediaUrl}/${item.fname}`"
                      :lazy-src="`${mediaUrl}/${item.fname}`" controls disablepictureinpicture
                      controlsList="nodownload noplaybackrate" autoplay @contextmenu.prevent loop
                      style=" height:100vh; width:100%; object-fit: cover;">
                    </video>
                  </template>
                  <v-card-text class="text-center imgdesc pb-0 pt-1 px-2" style="line-height: 15px;">{{
                    item.description
                    ?? '' }}</v-card-text>
                </v-container>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </div>
        <!-- video content -->
        <v-card flat v-else-if="topic.mp4DataList?.length > 1"
          class="d-flex flex-wrap bg-transparent justify-content-start align-items-center video-cards gap-4 mt-3"
          :class="videoCard" :height="dynamicHeight" :width="dynamicWidth">
          <div v-for="video in topic.mp4DataList" :key="video.furl"
            class="d-flex justify-content-center align-items-center flex-column">
            <v-card elevation="5" width="200" height="auto"
              class="p-0 bg-transparent d-flex align-items-center justify-content-center border-card flex-column">
              <v-overlay v-model="videoOverlay" class="align-center justify-center" contained>
                <v-btn variant="text" size="50" @click="selectVideo(video)">
                  <v-icon class="mdi mdi-play-circle-outline" size="50" color="#EFEBE9"></v-icon>
                </v-btn>
              </v-overlay>
              <video :poster="posterUrl(video.thumbnailName)"
                :src="`${mediaUrl}/${video.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`"
                :lazy-src="`${mediaUrl}/${video.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`"
                style=" height:120px; width:250px; object-fit: contain;"></video>
            </v-card>
            <v-card-text class="text-center p-0 py-3 text-wrap">{{ video.name }}</v-card-text>
          </div>
        </v-card>
        <!-- only video present without images -->
        <v-card flat v-else-if="topic.mp4DataList?.length === 1" class="bg-transparent" height="80vh">
          <div v-for="video in topic.mp4DataList" :key="video.furl" class="mx-auto">
            <v-card class="bg-transparent" flat v-if="carouselItems && carouselItems.length > 0" :height="dynamicHeight"
              :width="dynamicWidth">
              <video :poster="posterUrl(video.thumbnailName)"
                :src="`${mediaUrl}/${video.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`"
                :lazy-src="`${mediaUrl}/${video.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`"
                style=" height:100%; width:100%; object-fit: contain;" autoplay controls disablepictureinpicture
                controlsList="nodownload noplaybackrate" @contextmenu.prevent loop></video>
            </v-card>

            <v-card-text class="text-center p-0 py-4">{{ video.name }}</v-card-text>
          </div>
        </v-card>
        <!-- dialog to show video content -->
        <v-dialog v-model="videoShow" max-width="100%" class="bg-grey-darken-4" height="100%">
          <video :poster="posterUrl(selectedVideo.thumbnailName)"
            :src="`${mediaUrl}/${selectedVideo.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29') }`"
            :lazy-src="`${mediaUrl}/${selectedVideo.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29') }`"
            controls disablepictureinpicture controlsList="nodownload noplaybackrate" autoplay @contextmenu.prevent
            style="height: 100%; object-fit: contain;" class="dialog-video"
            @play="this.$store.commit('setIsVideoPlaying', true);"
            @pause="this.$store.commit('setIsVideoPlaying', false);"
            @ended="videoShow = false;this.$store.commit('setIsVideoPlaying', false);">
          </video>
          <div class="d-flex justify-content-end">
            <v-icon class="mdi mdi-close close-video" color="white"
              @click="videoShow = false;this.$store.commit('setIsVideoPlaying', false);"></v-icon>
          </div>
        </v-dialog>
      </div>
      <!-- Bottom navigation -->
      <div class="nav mb-2">
        <v-btn icon="mdi-home" variant="outlined" elevation="10" class="home-btn"
          @click="$router.push('/digitalBoard/selectedTopics');"
          v-if="$store.getters.getSelectedTopics.length > 1"></v-btn>
        <!-- Translate -->
        <v-card class="translate-btn text-capitalize p-2 rounded-5" elevation="10" @click="translate"
          :loading="transLoad" :disabled="transLoad">
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
import defaultImg from '@/assets/aksharamBG.jpeg';
import AudioPlayer from './AudioPlayer.vue';
export default {
components: {AudioPlayer},
  data() {
    return {
      dialog: false,
      reorderedImages: [],
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2,
      isScrolledToBottom: false,
      isScrolledToTop: true,
      transLoad: false,
      overlayvideo: true,
      videoShow: false,
      selectedVideo: null,
      videoOverlay: true,
      fallbackPoster: require('@/assets/aksharamBG.jpeg'),
    }
  },
  watch: {
    resetTime(newValue) {
      if (newValue) {
        this.dialog = false;
      }
    },
     dialog(newValue) {
       if (!newValue) {
         this.$store.commit('setIsVideoPlaying',false)
       }
     }
  },
  computed: {
    resetTime() {
      return this.$store.getters.getResetTime;
    },
    mainTopics() {
      return this.$store.getters.getMainData;
    },
    language() {
      return this.$store.getters.getLanguage;
    },
    mediaUrl() {
      return this.$store.getters.getMediaUrl; 
    },
    dynamicFontSize() {
      const length = this.mainTopics[0].title.length;

      
      if (length <= 50) return '2rem'; 
      if (length <= 100) return '1.75rem'; 
      if (length <= 150) return '1.5rem'; 
      return '1.25rem'; 
    },
    sortedCombinedDataSubList() {
      if (!this.mainTopics[0].combinedDataSubList) return [];

      // Determine locale based on current language
      // const locale = this.currentLanguage === 'ml' ? 'ml' : 'en';

      return [...this.mainTopics[0].combinedDataSubList].sort((a, b) => {
        const titleA = a.title?.trim() || ''; // Handle null/undefined titles
        const titleB = b.title?.trim() || '';
        return titleA.localeCompare(titleB);
      });
    },
    // posterUrl() {
    //   console.log("posterUrl");
    // const mainPoster = `${this.mediaUrl}/${this.carouselItems.thumbnailName}`;
    // if(this.carouselItems.thumbnailName){
    //   return mainPoster
    // }else {
    //   return this.fallbackPoster;
    // }
    // },
    carouselItems() {
      const images = this.mainTopics[0].imgDataList.map(image => ({
        type: 'image',
        furl: image.furl,
        fname: image.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29'),
        description: image.description,
        name: image.name
      }));
      const videos = this.mainTopics[0].mp4DataList.map(video => ({
        type: 'video',
        furl: video.furl,
        fname: video.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29'),
        description: video.name ,
        thumbnailName: video.thumbnailName
        ? video.thumbnailName.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
        : null
      }));
      return [...images, ...videos];
      // return [...images];
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
      }else return "100vw";
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
        'background-image': `radial-gradient(circle at center center, rgba(28,27,27, 0.78), rgba(0,0,0, 0.69)), ${this.getBackgroundImage(this.mainTopics[0])}`
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
  mounted() {
    this.goToTopic();
    console.log("carousel",this.carouselItems);
    console.log("malayalam order",this.sortedCombinedDataSubList)
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
    posterUrl(thumbnailName) {
    const mainPoster = `${this.mediaUrl}/${thumbnailName}`;
    if(thumbnailName){
      return mainPoster
    }else {
      return this.fallbackPoster;
    }
    },
    selectVideo(video) {
      this.selectedVideo = video;
      this.videoShow = true;
    },
    async goToSub(topic) {
      try {
        const res = await this.$store.dispatch('getSubDetails', { id: topic.fsCommonId, language: this.language });
        if (res) {
          this.$router.push({ name: 'subPage' });
        }
      }
      catch (error) {
        console.error(error);
      }
    },
    async goToSub2(topic, event) {
      event.stopPropagation();
      try {
        const res = await this.$store.dispatch('getSub2Details', { id: topic.ssCommonId, language: this.language });
        if (res) {
          this.$router.push({ name: 'sub2Page' });
        } 
      }
      catch (error) {
        console.error(error);
      }
    },
    getBackgroundImage(topic) {
      if (topic.backgroundImgList && topic.backgroundImgList.length > 0) {
        const bgUrl = topic.backgroundImgList[0].bgName.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
        const backgroundImage = `${this.mediaUrl}/${bgUrl}` || '';
        return `url(${backgroundImage})`;
      }
      return `url(${defaultImg})`;
    },
    openDialog(index) {
    const imgDataList = this.mainTopics[0].imgDataList.map(image => ({
      type: 'image',
      furl: image.furl,
      fname: image.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29'),
      description: image.description || '',
      name: image.name
    }));
    const mp4DataList = this.mainTopics[0].mp4DataList.map(video => ({
      type: 'video',
      furl: video.furl,
      fname: video.fname.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29'),
      description: video.name || '' ,
      thumbnailName: video.thumbnailName
        ? video.thumbnailName.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
        : null
    }));
      const combinedList = [...imgDataList, ...mp4DataList];
    this.reorderedImages = [
      ...combinedList.slice(index),
      ...combinedList.slice(0, index)
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
        const malayalamRegex = /([\u0D00-\u0D7F]+)/g;
        return description
          .replace(/\n/g, '<br>')
          .replace(
            malayalamRegex,
            '<span class="mal-text">$1</span>'
          );
      } else {
        return '';
      }
    },
    async goToTopic() {
      try {
        this.transLoad = true;
        const res = await this.$store.dispatch('getMainDetails', { language: this.language, item: this.mainTopics[0].commonId });
        if (res) {
          this.transLoad = false;
        }
      }
      catch (error) {
        this.transLoad = false
        console.log(error)
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
.video {
  padding-top: 12%;
  object-fit: contain;
  width: 100%;
  height: 100%;
  background-position: center;
}
.border-card {
  border: 2px solid cornsilk;
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
:deep(.v-carousel__controls__item .v-btn) {
  opacity: 0.7;
}
:deep(.v-carousel__controls) {
  background: transparent;
}
:deep(.v-carousel__controls__item .v-btn__content i){
  color: rgb(168, 159, 120);
}
:deep(.v-carousel__controls__item.v-btn--active .v-btn__content i) {
  color: rgb(6, 6, 6);
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
:deep(.carousel .mdi:before){
  font-size: 10px;
}
:deep(.close.mdi:before){
  font-size: 20px;
  width: 5px;
  /* height: 10px; */
}
 .audio-element {
  width: fit-content;
  border-radius: 50px;
   position: absolute;
   z-index: 100;
   right: 50%;
  transform: translateX(-50%);
   left: 50%;
  border: 2px solid cornsilk;
 }
 audio{
  padding: 0;
  margin: 0;
 }
audio::-webkit-media-controls-panel{
  background: #ed0707;
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
  .audio-element {
      top: 18.5%;
      transition: translateY(-19%);
    }
  .topic-list {
    justify-content: center;
    position: relative;
  }
   .video-cards {
        overflow-x: hidden;
        overflow-y: auto;
      }
  .title h1 {
    margin-top: 3%;
    margin-bottom: 2%;
    position: absolute;
    top: 2%;
    padding-inline: 10px;
  }
  .image-card{
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
}
@media only screen and (orientation: landscape) {
  .audio-element {
      bottom: 5%;
    }
  .card {
    width: 80%;
    position: relative;
  }
      .video-cards {
      overflow-x: auto;
      overflow-y: hidden;
    }
  
    .dialog-video {
      position: relative;
    }
  
    .close-video {
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 100;
    }
  .main-card {
    height: 75vh;
  }
  :deep(.v-carousel__controls) {
    height: 30px;
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