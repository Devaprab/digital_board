export default {
    setAllTopics(state, payload) {
          state.mainTopics = payload;
          sessionStorage.setItem('mainTopics', JSON.stringify(payload));
      },
      setLanguage(state, newDtId) {
        state.language = newDtId;
      },
      setTopic(state, { index, data }) {
        if (state.selectedTopics.length <= index) {
          state.selectedTopics.splice(index, 1, data);
        } else {
          state.selectedTopics[index] = data;
        }
      },
      clearSelectedTopics(state) {
        state.selectedTopics = [];
      },
      setFirstSub(state, payload) {
        state.firstSub = payload;
        sessionStorage.setItem('firstSub', JSON.stringify(payload));
      },
      
}
