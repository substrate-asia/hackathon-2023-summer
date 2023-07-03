const state = {
  queryForm: {
    page: 1,
    size: 20,
    search: '',
    id: '',
    fc_nums: -1, //-1 ,means all, 6 means the fc_nums > 6
    fc_name: '',
    c_img: '',
    c_fore: '',
    c_back: '',

    address__is_located: true,
    address__city: '',
    address__longitude__range: '',
    address__latitude__range: '',
  },
}

const mutations = {
  setQuery(state, newVal) {
    state.queryForm = newVal
  },
}

const actions = {
  setQuery({ commit }, newVal) {
    commit('setQuery', newVal)
  },
}

export default {
  state,
  mutations,
  actions,
}
