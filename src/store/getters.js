export default {
    getUrl: (state) => state.baseUrl,
    getLanguage: (state) => state.language,
    getTopics: (state) => state.mainTopics,
    getSelectedTopics: (state) => state.selectedTopics,
    getFirstSub : (state) => state.firstSub,
}