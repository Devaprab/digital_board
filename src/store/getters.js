export default {
    getUrl: (state) => state.baseUrl,
    getLanguage: (state) => state.language,
    getTopics: (state) => state.mainTopics,
    getSelectedTopics: (state) => state.selectedTopics,
    getSelectedCommonIds: (state) => state.selectedCommonIds,
    getFirstSub : (state) => state.firstSub,
}