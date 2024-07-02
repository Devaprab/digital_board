export default {
    setAllTopics(state, payload) {
          state.mainTopics = payload;
          sessionStorage.setItem('mainTopics', JSON.stringify(payload));
      },
      setLanguage(state, newDtId) {
        state.language = newDtId;
      },
      
}
