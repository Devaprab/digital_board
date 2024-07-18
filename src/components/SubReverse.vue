<template>
  <div class="d-flex justify-content-end">
    <div class="sub-card d-flex justify-content-end">
      <div class="text-card pe-5 pt-5 mb-5">
        <!-- <div class="details "> -->
          <!-- <div v-if="combinedDataSubSubList && combinedDataSubSubList.length > 0" class="d-flex justify-content-end">
            <v-btn @click="goToTopic()">Click here</v-btn>
          </div> -->
        <div class="details-content">
          <div class="d-flex gap-3 align-items-center">
          
          <v-icon class="mdi mdi-arrow-right text-white" v-if="combinedDataSubSubList && combinedDataSubSubList.length > 0"
            @click="goToTopic()"></v-icon>
            <h4 class="text-start title my-0">{{ title }}</h4>
        </div>
          <!-- <p class="desc text-start">
          <pre class="text-wrap desc text-justify pe-2">{{ description }}
            <ul v-for="topic in combinedDataSubSubList" :key="topic.uId">
            <li class="text-capitalize text-start" style="direction: ltr;">{{ topic.title }}</li>
          </ul>
          </pre>
          </p> -->
          <p class="text-wrap   text-justify px-5 mt-5" v-html="description"></p>
            <!-- <div v-if="topic.combinedDataSubList && topic.combinedDataSubList.length >=1 " class="px-5">
              <ol v-for="sub in topic.combinedDataSubList" :key="sub.commonId">
                <li @click="goToSub(sub)" class="subtopics">{{ sub.title }}
                  <div v-if="sub.combinedDataSubSubList && sub.combinedDataSubSubList.length >=1 ">
                    <ul v-for="top in sub.combinedDataSubSubList" :key="top.commonId">
                      <li style="font-size: 100%;">{{ top.title }}</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div> -->
          <!-- </div> -->
        </div>
        <div class="carousel-wrapper d-flex flex-column align-items-end">
          <v-carousel class="sub-carousel" height="400" hide-delimiters cover :show-arrows="images.length > 1">
            <v-carousel-item @click="openDialog(image.furl)" :src="image.furl" cover v-for="(image, index) in images"
              :key="index" class="sub-carousel">
            </v-carousel-item>
          </v-carousel>
          <v-btn class="video-btn mt-3" rounded="3" variant="elevated" v-if="video.length>0" @click="openVideoDialog">
            <v-icon class="mdi mdi-video"></v-icon>Watch Video</v-btn>
        </div>
      </div>
      <v-dialog v-model="dialog" max-width="650">
        <v-img :src="selectedImage" contain></v-img>
      </v-dialog>
      <v-dialog v-model="videoDialog" max-width="800px">
        <v-card>
          <v-toolbar dense>
            <v-btn icon dark @click="closeVideoDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <video controls width="100%" v-if="video.length > 0" :src="video[0].furl" type="video/*">
              Your browser does not support the video tag.
            </video>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
  <v-dialog v-model="editDialog" width="1000">
    <edit-form :head="head" :description="description" :images="images" :video="video" :url="url" :audio="audio"
      @finish="editDialog = false"></edit-form>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      selectedImage: null,
      videoDialog: false,
      videoUrl: '',
    };
  },
  computed: {
        language() {
            return this.$store.getters.getLanguage;
        }
    },
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    images: {
      type: Array,
      default: () => []
    },
    video: {
      type: Array,
      default: () => []
    },
    audio: {
      type: Array,
      default: () => []
    },
    fsCommonId: {
      type: String,
      default: ''
    },
    uId: {
      type: String,
      default: ''
    },
    combinedDataSubSubList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    viewSublist() {
      const sublist =    {
        head: this.title,
        title: this.title,
        description: this.description,
        images: this.images,
        video: this.video,
        audio: this.audio,
        fsCommonId: this.fsCommonId,
        combinedDataSubSubList: this.combinedDataSubSubList
    }
      this.$store.commit('setSecondSub', sublist);
      console.log('getters', this.$store.getters.getSecondSub)
    
      this.$router.push({ name: 'Sublist'});
      // console.log(sublist)
    },
    openDialog(imageSrc) {
      this.selectedImage = imageSrc;
      this.dialog = true;
    },
    openVideoDialog() {
      // Set the video URL to the one you want to display
      this.videoUrl = 'https://my-new-aks.s3.ap-south-1.amazonaws.com/1715602317290_talking_juracik_park_seed5948811234009426.mp4';
      this.videoDialog = true; // Open the dialog
    },
    closeVideoDialog() {
      this.videoDialog = false; // Close the dialog
      // Optionally, pause the video when dialog closes
      const videoElement = this.$refs.videoPlayer;
      if (videoElement) {
        videoElement.pause();
      }
    },
    async goToTopic() {
      const payload = {
          language: this.language,
          CId: this.fsCommonId
        }
        try {
          const response = await this.$store.dispatch('getSecondDetails', payload)

        if (response) {
          // this.subTopic = response.data;
          console.log('item',response.data);
          this.$router.push({name:'Sublist'})
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
      },
  },
};
</script>

<style scoped>
.sub-card {
  width: 75%;
    aspect-ratio: 1676 / 800;
    height: 40rem;
    background-color: #363A33;
    color: #ffffff;
    border-radius: 60px 0 0 60px;
    position: relative;
}
.text-card {
  width: 75%;  
  aspect-ratio: 1107 / 600;
}
.carousel-wrapper {
  /* width: 100%; */
  aspect-ratio: 813/650;
  position: absolute;
  right: 80%;
  top: 8%;
  width: 50%;
  aspect-ratio: 271 / 200; 
}
.sub-carousel {
  width: 100%;  
  height: 100%;
  cursor: pointer;
}
.desc,
.details-content {
  /* padding-right: 25%; */
  width: 100%;
  font-size: 110%;
  aspect-ratio: 1107 / 600;
    line-height: 180%;
    height: 24rem;
direction: ltr;
}
.title{
  font-size: 140%;
    line-height: 180%;
}

.details-content{
  direction: rtl;
}
::-webkit-scrollbar,
:deep(::-webkit-scrollbar) {
  width: 4px;
  height: auto;
}
::-webkit-scrollbar-track,
:deep(::-webkit-scrollbar-track) {
  background: #272B25;
}
::-webkit-scrollbar-thumb,
:deep(::-webkit-scrollbar-thumb) {
  background: #8D9387;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb:hover,
:deep(::-webkit-scrollbar-thumb:hover) {
  background: #f5eded;
  cursor: pointer;
}
:deep(pre) {
  text-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: auto;
  max-height: 25rem;
  padding-right: 5px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: justify;
  font-size: 20px;
  direction: ltr;
}
</style>