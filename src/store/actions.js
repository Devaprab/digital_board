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
}