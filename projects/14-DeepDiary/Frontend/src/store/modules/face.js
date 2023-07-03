const state = {
  isGroupMode: true, // if this is true-->group mode, false-->single people mode
}

const mutations = {
  setMode(state, newVal) {
    state.isGroupMode = newVal
  },
}

const actions = {
  setMode({ commit }, newVal) {
    commit('setMode', newVal)
  },
}

export default {
  state,
  mutations,
  actions,
}
