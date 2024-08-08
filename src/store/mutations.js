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
   setMainData(state, payload) {
    state.mainData = payload;
    sessionStorage.setItem('mainData', JSON.stringify(payload));
  },
  setFirstSub(state, payload) {
    state.firstSub = payload;
    sessionStorage.setItem('firstSub', JSON.stringify(payload));
  },    
   setSecondSub(state, payload) {
    state.secondSub = payload;
    sessionStorage.setItem('secondSub', JSON.stringify(payload));
  },
  // setSubFirstTitle(state, payload){
  //   state.subFirstTitle = payload;
  //   sessionStorage.setItem('subFirstTitle', JSON.stringify(payload));
  // }
  setSubFirstTitle(state, payload){
    state.subFirstTitle = payload;
    sessionStorage.setItem('subFirstTitle', JSON.stringify(payload));
  },
  setClearTitle(state){
    state.subFirstTitle = [];
    sessionStorage.setItem('subFirstTitle', []);
  }
}
