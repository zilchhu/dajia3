import { createStore } from 'vuex'
import { getTable } from './api'

const store = createStore({
  state() {
    return {
      table: null
    }
  },
  getters: {
    table1({ table }) {
      return formatTable(table)
    }
  },
  mutations: {
    initTable(state, payload) {
      state.table = payload
    }
  },
  actions: {
    async initTable({ commit }) {
      const getTableRes = await getTable()
      commit('initTable', getTableRes)
    }
  }
})

function percent(num) {
  if (typeof num === 'string') num = parseFloat(num)
  return `${(num * 100).toFixed(2)}%`
}

function fixed2(num) {
  if (typeof num === 'string') num = parseFloat(num)
  return num.toFixed(2)
}

export function formatTable(table) {
  if (!table || table.err) return table
  return {
    ...table,
    data: table.data.map(v => ({
      ...v,
      income: fixed2(v.income),
      income_avg: fixed2(v.income_avg),
      income_sum: fixed2(v.income_sum),
      cost: fixed2(v.cost),
      cost_avg: fixed2(v.cost_avg),
      cost_sum: fixed2(v.cost_sum),
      cost_ratio: percent(v.cost_ratio),
      cost_sum_ratio: percent(v.cost_sum_ratio),
      consume: fixed2(v.consume),
      consume_avg: fixed2(v.consume_avg),
      consume_sum: fixed2(v.consume_sum),
      consume_ratio: percent(v.consume_ratio),
      consume_sum_ratio: percent(v.consume_sum_ratio),
      settlea_30: percent(v.settlea_30),
      settlea_1: percent(v.settlea_1),
      settlea_7: percent(v.settlea_7),
      settlea_7_3: percent(v.settlea_7_3),
      income_score: fixed2(v.income_score),
      cost_score: fixed2(v.cost_score),
      consume_score: fixed2(v.consume_score),
      score: fixed2(v.score)
    }))
  }
}

export default store
