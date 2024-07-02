import { createStore } from 'vuex';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';
import rootActions from './actions.js';
const store = createStore({
  state() {
    return {
      // baseUrl: 'http://localhost:8082',
      // baseUrl: 'http://192.168.1.35:8081',
      baseUrl: 'https://aksharammuseum.com',
      language: sessionStorage.getItem('language') || 2,
      mainTopics: JSON.parse(sessionStorage.getItem('mainTopics')) || [],
    }
},
getters: rootGetters,
mutations: rootMutations,
actions: rootActions
});
export default store;