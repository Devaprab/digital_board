export default {
  setAllTopics(state, payload) {
    state.mainTopics = payload;
    sessionStorage.setItem('mainTopics', JSON.stringify(payload));
  },
  setLanguage(state, newDtId) {
    state.language = newDtId;
    sessionStorage.setItem('language', newDtId)
  },
  setTopic(state, payload) {
    state.selectedTopics= payload;
    sessionStorage.setItem('selectedTopics', JSON.stringify(payload));
  },
  clearSelectedTopics(state) {
    state.selectedTopics = [];
  },
  setCommonIds(state, payload) {
    state.selectedCommonIds = payload;
    sessionStorage.setItem('selectedCommonIds', JSON.stringify(payload));
  },
  setFirstSub(state, payload) {
    state.firstSub = payload;
    sessionStorage.setItem('firstSub', JSON.stringify(payload));
  },     
}
