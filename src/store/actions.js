import axios from 'axios';
export default {
  //get topic lists
    async getTopics({commit, rootGetters}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry1/getMainComplete?dtId=${payload}`);
        if (response.status >= 200 || response.status < 300) {
          // console.log(response.data);
            commit('setAllTopics', response.data);
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
  },
  //setting selected topics details
  async selectedTopics({ commit, rootGetters }, payload) {
    commit('clearSelectedTopics');
    const topicDataArray = [];
    const topicPromises = payload.selectedTopics.slice(0, 5).map(async (topicId, index) => {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/qrcode/getScanDetails?dtId=${payload.language}&commonId=${topicId}`);
        if (response.status >= 200 && response.status < 300) {
          return response.data;
        }
      } catch (error) {
        console.error(`Error fetching topic ${index + 1}`, error);
        return null;
      }
    });
    const results = await Promise.all(topicPromises);
    results.forEach(result => {
      if (result) {
        topicDataArray.push(result);
      }
    });
    commit('setTopic', topicDataArray);
    return results.every(result => result !== null);
  },
  //main topic details
    async getMainDetails({commit, rootGetters}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/qrcode/getScanDetails?dtId=${payload.language}&commonId=${payload.item}`);
        if (response.status >= 200 || response.status < 300) {
          // console.log(response.data);
          commit('setMainData', response.data);
          return true;
        }
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
  },
  //First Sub Details
    async getSubDetails({ rootGetters, commit}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry2/getAllByCommonId/${payload.id}?dtId=${payload.language}`);
        if (response.status >= 200 && response.status < 300) {
          commit('setSubData', response.data[0])
          return true;
        }
      }
      catch (err) {
        throw Error(err.response? err.response.data : err.message);
      }
  },
    //second sub details
    async getSub2Details({ rootGetters, commit}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry3/getSecondSub?dtId=${payload.language}&ssCommonId=${payload.id}`);
        if (response.status >= 200 && response.status < 300) {
          commit('setSub2Data', response.data[0])
          return true;
        }
      }
      catch (err) {
        throw Error(err.response? err.response.data : err.message);
      }
    },
}