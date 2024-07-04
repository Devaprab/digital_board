import { createStore } from 'vuex';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';
import rootActions from './actions.js';
const store = createStore({
  state() {
    return {
      // baseUrl: 'http://localhost:8448',
      // baseUrl: 'http://192.168.1.30:8083',
      baseUrl: 'https://aksharammuseum.com',
      selectedCommonIds: JSON.parse(sessionStorage.getItem('selectedCommonIds')) || [],
      selectedTopics: JSON.parse(sessionStorage.getItem('selectedTopics')) || [],
      language: sessionStorage.getItem('language') || 2,
      mainTopics: JSON.parse(sessionStorage.getItem('mainTopics')) || [],
      mainData: JSON.parse(sessionStorage.getItem('mainData')) || [],
      firstSub: JSON.parse(sessionStorage.getItem('firstSub')) || [],
      secondSub: JSON.parse(sessionStorage.getItem('secondSub')) || []
    }
},
getters: rootGetters,
mutations: rootMutations,
actions: rootActions
});
export default store;