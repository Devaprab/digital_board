export default {
    getUrl: (state) => state.baseUrl,
    getLanguage: (state) => state.language,
    getTopics: (state) => state.mainTopics,
    getSelectedTopics: (state) => state.selectedTopics,
    getSelectedCommonIds: (state) => state.selectedCommonIds,
    getMainData:(state) => state.mainData,
    getFirstSub: (state) => state.firstSub,
    getSecondSub: (state) => state.secondSub,
    getPath1: (state) => state.path1,
    getPath2: (state) => state.path2,
    getFirstSubTitle: (state) => state.subFirstTitle,
    getResetTime: (state) => state.resetTime
}