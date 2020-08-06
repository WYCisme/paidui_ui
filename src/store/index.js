import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverHostIP:"localhost",
  },
  mutations: {
      setIP(state,serverHostIP){
          state.serverHostIP = serverHostIP
      }
  },
  actions: {
  },
  modules: {
  }
})
