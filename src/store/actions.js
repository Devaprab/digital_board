import axios from 'axios';
export default {
  //get topic lists
    async getTopics({commit, rootGetters}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry1/getMainComplete?dtId=${payload}`);
        if (response.status >= 200 || response.status < 300) {
          const filteredData = response.data.filter(item => item.commonId !== null ) 
          commit('setAllTopics', filteredData);
          return true;
        }
      } catch (error) {
        throw Error(error);
      }
  },
  //setting selected topics details
  async selectedTopics({ commit, rootGetters }, payload) {
    commit('clearSelectedTopics');
    const topicDataArray = [];
    const topicPromises = payload.selectedTopics.map(async (topicId, index) => {
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
          if (response.data[0].referenceUrl) {
            const description = response.data[0].referenceUrl.split('\n').reduce((map, name) => {
            const [key, description] = name.split('#');
              map[key] = description;
            return map;
          }, {});
          response.data[0].imgDataList = response.data[0].imgDataList.map(image => {
            const imageName = image.fname.replace(/^[^_]*_|(.jpg|.jpeg|.png|.gif|.bmp|.tiff|.svg|.webp|.heif|.heic)$/gi, '');
            const name = imageName.split('_').join(' ');
            return {
              ...image,
            name: name,
            description: description[imageName]
            };
          });
          }
          response.data[0].mp4DataList = response.data[0].mp4DataList.map(video => {
              const videoName = video.fname.replace(/^[^_]*_|(.mp4|.mov|.wmv|.avi|.mkv|.flv|.webm|.mpeg|.mpg|.3gp|.m4v|.ogg|.mxf|.ts|.vob|.rm|.rmvb|.asf|.m2ts)$/gi, '');
              const name = videoName.split('_').join(' ');
              return {
                ...video,
                name: name,
              };
          });
          commit('setMainData', response.data);
          return true;
        }
      } catch (error) {
        throw Error(error);
      }
  },
  //First Sub Details
    async getSubDetails({ rootGetters, commit}, payload) {
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry2/getAllByCommonId/${payload.id}?dtId=${payload.language}`);
        if (response.status >= 200 && response.status < 300) {
          if(response.data[0].referenceUrl){
          const description = response.data[0].referenceUrl.split('\n').reduce((map, name) => {
            const [key, description] = name.split('#');
            map[key] = description;
            return map;
          }, {});
          response.data[0].imgDataList = response.data[0].imgDataList.map(image => {
            const imageName = image.fname.replace(/^[^_]*_|(.jpg|.jpeg|.png|.gif|.bmp|.tiff|.svg|.webp|.heif|.heic)$/gi, '');
            const name = imageName.split('_').join(' ');
            return {
              ...image,
            name: name,
            description: description[imageName]
            };
          });
          }
          response.data[0].mp4DataList = response.data[0].mp4DataList.map(video => {
              const videoName = video.fname.replace(/^[^_]*_|(.mp4|.mov|.wmv|.avi|.mkv|.flv|.webm|.mpeg|.mpg|.3gp|.m4v|.ogg|.mxf|.ts|.vob|.rm|.rmvb|.asf|.m2ts)$/gi, '');
              const name = videoName.split('_').join(' ');
              return {
                ...video,
                name: name,
              };
            });
          commit('setFirstSub', response.data[0])
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
          if(response.data[0].referenceUrl){
            const description = response.data[0].referenceUrl.split('\n').reduce((map, name) => {
              const [key, description] = name.split('#');
              map[key] = description;
              
              return map;
            }, {});
            response.data[0].imgData2List = response.data[0].imgData2List.map(image => {
              const imageName = image.fname.replace(/^[^_]*_|(.jpg|.jpeg|.png|.gif|.bmp|.tiff|.svg|.webp|.heif|.heic)$/gi, '');
              const name = imageName.split('_').join(' ');
              return {
                ...image,
                name: name,
              description: description[imageName]
              };
            });
          }
          response.data[0].mp4Data2List = response.data[0].mp4Data2List.map(video => {
              const videoName = video.fname.replace(/^[^_]*_|(.mp4|.mov|.wmv|.avi|.mkv|.flv|.webm|.mpeg|.mpg|.3gp|.m4v|.ogg|.mxf|.ts|.vob|.rm|.rmvb|.asf|.m2ts)$/gi, '');
              const name = videoName.split('_').join(' ');
              return {
                ...video,
                name: name,
              };
            });
          commit('setSecondSub', response.data[0])
          return true;
        }
      }
      catch (err) {
        throw Error(err.response? err.response.data : err.message);
      }
    },
    // get Subheading title
    async getSubTitle({commit, rootGetters}, payload) {
      commit('setClearTitle');
      try {
        const response = await axios.get(`${rootGetters.getUrl}/api/DataEntry1/getSubDataByCommonId?dtId=${payload.language}&commonId=${payload.id}`);
        if (response.status >= 200 && response.status < 300) {
          const subData = response.data
            commit('setSubFirstTitle', subData);
            return true;
        }
      } catch (err) {
        throw Error(err.response? err.response.data : err.message);
      }
  },
}