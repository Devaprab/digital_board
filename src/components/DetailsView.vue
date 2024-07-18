<template>
    <div class="full-page">
        <div class="d-flex justify-content-between align-items-center nav mx-5 pt-5 pb-3">
            <router-link to="/digitalBoard/selectedTopics"><v-btn class="home-btn text-capitalize" rounded
                    size="x-large"><v-icon class="mdi mdi-arrow-left"></v-icon>Back</v-btn></router-link>
            <h1 style="color: white; font-size: 360%;" class="text-center">{{subTopic.title}}</h1>
            <v-btn class="" size="large" @click="toggleDtId" style="color: #3e7132;">
        <svg width="40" height="40" viewBox="0 0 85 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.8">
            <path fill-rule="evenodd" clip-rule="evenodd" :d="path1" fill="#216D17" />
            <path :d="path2" fill="#216D17" />
          </g>
        </svg>
        Translate</v-btn>
        </div>

        <div class="mb-5 ">
            <SubCard :description="subTopic.description" :images="subTopic.imgDataList ? subTopic.imgDataList : []"
                :video="subTopic.mp4DataList" :head="subTopic.title" :url="subTopic.referenceUrl"
                :commonId="subTopic.commonId" :audio="subTopic.mp3DataList" :uId="subTopic.uId"
                :combinedDataSubSubList="subTopic.combinedDataSubSubList ? subTopic.combinedDataSubSubList : []"
                :combinedDataSubList="subTopic.combinedDataSubList ? subTopic.combinedDataSubList : []"/>
        </div>
        <div v-for="(topic,index) in subTopic.combinedDataSubList" :key="index" class="my-5">
            <div v-if="index % 2 === 0" class="mt-3 ">
                <SubReverse 
                    :head="topic.title" 
                    :title="topic.title" 
                    :description="topic.description"
                    :images="topic.imgDataList ? topic.imgDataList : []" :video="topic.mp4DataList"
                    :audio="topic.mp3DataList" 
                    :fsCommonId="topic.fsCommonId"
                    :combinedDataSubSubList="topic.combinedDataSubSubList ? topic.combinedDataSubSubList : []" />
            </div>
            <div v-else class="my-5">
                <SubCard 
                    :head="topic.title" 
                    :title="topic.title" 
                    :description="topic.description"
                    :images="topic.imgDataList ? topic.imgDataList : []" :video="topic.mp4DataList"
                    :audio="topic.mp3DataList" 
                    :fsCommonId="topic.fsCommonId"
                    :combinedDataSubSubList="topic.combinedDataSubSubList ? topic.combinedDataSubSubList : []"/>
            </div>
        </div>
    </div>
</template>

<script>
import SubCard from './SubCard.vue';
import SubReverse from './SubReverse.vue'
export default {
  data() {
    return {
      path1: this.$store.getters.getPath1,
      path2: this.$store.getters.getPath2
    };
  },
    components: {
        SubCard,
        SubReverse
    },
    computed: {
        subTopic() {
            return this.$store.getters.getMainData[0];
        },
        language() {
            return this.$store.getters.getLanguage;
        }
    },
    mounted() {
        console.log(this.$store.getters.getFirstSub)
        document.body.style.backgroundImage = 'linear-gradient(to right,#0B0F0A,#56754E)';
        this.goToTopic();
    },
    beforeUnmount() {
        document.body.style.backgroundImage = ''; 
    },
    methods: {
        async goToTopic() {
        const payload = {
          language: this.language,
          CId: this.subTopic.commonId
        }
        try {
          const response = await this.$store.dispatch('getScanDetails', payload)

        if (response) {
          this.$router.push({name:'details'})
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
      },
      translate() {
            if (this.language === 1) {
                this.$store.commit('setLanguage', 2);
            } else {
                this.$store.commit('setLanguage', 1);
            }
            this.goToTopic()
        }
    }
}
</script>

<style scoped>
.full-page {
    height: 100%;
    padding-top: 10px;
    background-image: linear-gradient(to right,#0B0F0A,#56754E);
    background-size: cover;
}
.home-btn {
    background-color:  #FFB4AB;
    color: #690005;
}
.translate-btn{
    background-color: #F5F5F5;
    color: #216D17;
    letter-spacing: 0px !important;
    padding-inline: 48px;
}
</style>