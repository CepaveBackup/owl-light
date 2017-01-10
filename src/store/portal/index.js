import fetch from '~utils/fetch'
import vfetch from '~utils/vuex-fetch'

module.exports = {
  namespaced: true,
  state: {
    hostGroups: [],
    hosts: [],
    hasEndpointLoading: true,
    searchHostGroupInput: '.+',
    hostGroupListItems: [],
    hostList: {
      hostGroup: '',
      hostListItems: [],
    },
    tempDeleteCandidate: {
      name: '',
      id: 0,
    },
    hostInGroupList: {},
  },
  actions: {
    'getEndpoints'({ commit, state }, { q }) {
      commit('getEndpoints.start')

      const opts = {
        url: 'graph/endpoint',
        params: {
          limit: 500,
          q,
        },
        commit,
        mutation: 'getEndpoints',
      }

      return vfetch(opts)
    },

    'createHostGroupName'({ commit, state, dispatch }, { name, hosts }) {
      const opts = {
        method: 'post',
        url: 'hostgroup',
        data: {
          name,
        },
      }

      fetch(opts)
        .then((res) => {
          const data = {
            id: res.data.id,
            hosts,
          }
          dispatch('addHostsIntoNewHostGroup', data)
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    },

    'addHostsIntoNewHostGroup'({ commit, state }, { id, hosts }) {
      const opts = {
        method: 'post',
        url: 'hostgroup/host',
        data: {
          hostgroup_id: id,
          hosts,
        },
        commit,
        mutation: 'addHostsIntoNewHostGroup',
      }

      return vfetch(opts)
    },

    'getHostGroupList'({ commit, state }) {
      const opts = {
        method: 'get',
        url: 'hostgroup',
        mutation : 'getHostGroupList',
        commit,
      }

      return vfetch(opts)
    },

    'searchHostGroup'({ commit, state }, q = '') {
      if (!q.length) {
        q = '.+'
      }

      const opts = {
        method: 'get',
        url: 'hostgroup',
        params: {
          q,
        },
        mutation : 'searchHostGroup',
        commit,
      }

      return vfetch(opts)
    },

    'getHostsList'({ commit, state }, data) {
      const opts = {
        method: 'get',
        url: `hostgroup/${data.groupId}`,
        mutation : 'getHostsList',
        commit,
      }

      return vfetch(opts)
              .then((res) => {
                commit('hostInGroupList', data)
              })
    },

    'deleteHostGroup'({ commit, state, dispatch }, data) {
      const opts = {
        method: 'delete',
        url: `hostgroup/${data.id}`,
        mutation : 'deleteHostGroup',
        commit,
      }

      return vfetch(opts)
              .then((res) => {
                dispatch('getHostGroupList')
              })
    },

    'deleteHostFromGroup'({ commit, state, dispatch }, data) {
      const opts = {
        method: 'put',
        url: `hostgroup/host`,
        mutation : 'deleteHostFromGroup',
        data: {
          hostgroup_id: ~~data.groupId,
          host_id: ~~data.hostId,
        },
        commit,
      }

      return vfetch(opts)
              .then((res) => {
                dispatch('getHostsList', data)
              })
    },
  },
  mutations: require('./mutations'),
}
