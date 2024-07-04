import axios from 'axios';
export default {
    async getTopics({commit, rootGetters}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry1/getMainComplete?dtId=${payload}`);
        if (response.status >= 200 || response.status < 300) {
          console.log(response.data);
            commit('setAllTopics', response.data);
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
    },
    async selectedTopics({ commit, rootGetters }, payload) {
      commit('clearSelectedTopics');
      const topicPromises = payload.selectedTopics.slice(0, 5).map(async (topicId, index) => {
        try {
          const response = await axios.get(`${rootGetters.getUrl}/api/qrcode/getScanDetails?dtId=${payload.language}&commonId=${topicId}`);
          if (response.status >= 200 && response.status < 300) {
            console.log(`Topic ${index + 1}`, response.data);
            commit('setTopic', { index, data: response.data });
            return true;
          }
        } catch (error) {
          console.error(`Error fetching topic ${index + 1}`, error);
          return false;
        }
      });
  
      const results = await Promise.all(topicPromises);
      return results.every(result => result);
    },
    async getMainDetails({commit, rootGetters}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/qrcode/getScanDetails?dtId=${payload.language}&commonId=${payload.item}`);
        if (response.status >= 200 || response.status < 300) {
          console.log(response.data);
          commit('setFirstSub', response.data);
          return true;
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
    },
}