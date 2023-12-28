
import { getUserByToken } from '@/api/user';
const state =  {
  token: localStorage.getItem('token'),
  bgPath: localStorage.getItem('bg_path'),
  linkOpenWay: localStorage.getItem('link_open_way') || 0,
  userInfo: null
}

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
	state.userInfo = userInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
	localStorage.setItem('token', token)
  },
  SET_BG_IMAGE: (state, bgPath) => {
    state.bgPath = bgPath
	localStorage.setItem('bg_path', bgPath)
  },
  SET_LINK_OPEN_WAY:(state, way)=>{
	let openWay = parseInt(way)
	state.linkOpenWay = openWay
	localStorage.setItem('link_open_way', openWay)
  }
}

const actions = {
	getUserInfo({ commit, state }){
		return new Promise((resolve, reject) => {
			getUserByToken().then(res => {
			let data = res.data
			commit('SET_USER_INFO', data)
			commit('user/SET_BG_IMAGE', data.bgPath)
			resolve(data)
		  }).catch(error => {
			reject(error)
		  })
		})
	},
};

export default {
    namespaced: true,
	state,
	mutations,
    actions
}