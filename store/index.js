import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	namespaced:true,
    state: {
		paused:true
	},
    mutations: {
		setAudioPausedF (state) {
			state.paused = false
		},
		setAudioPausedT (state) {
			state.paused = true
		}
	},
    actions: {}
})
export default store