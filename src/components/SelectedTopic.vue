<template>
    <div>
        <topic-card></topic-card>
    </div>
</template>

<script>
import TopicCard from './TopicCard.vue'
import { mapGetters } from 'vuex';
export default {
  components: { TopicCard },
  computed: {
    ...mapGetters(['getSelectedTopics']),
    selectedTopics() {
      return this.getSelectedTopics;
    }
  },
  mounted () {
    console.log(this.selectedTopics);
  }

}

</script>

<style>

</style>