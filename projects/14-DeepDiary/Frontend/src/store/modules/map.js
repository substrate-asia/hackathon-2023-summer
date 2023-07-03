const state = {
  isShowSwiper: false,
  addrQueryForm: {
    search: '',
    id: '',
    is_located: true,
    longitude__range: '',
    latitude__range: '',
    country__contains: '',
    province__contains: '',
    city__contains: '',
    district__contains: '',
    location__contains: '',
    c_back: '',
    address__city: '',
  },
}

const mutations = {
  setSwiper(state, newVal) {
    state.isShowSwiper = newVal
  },
  setQuery(state, newVal) {
    state.addrQueryForm = newVal
  },
}

const actions = {
  setSwiper({ commit }, newVal) {
    commit('setSwiper', newVal)
  },
  setQuery({ commit }, newVal) {
    commit('setQuery', newVal)
  },
}

export default {
  state,
  mutations,
  actions,
}
