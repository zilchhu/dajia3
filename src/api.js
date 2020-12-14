import axios from 'axios'

const inst = axios.create({
  responseType: 'json',
  baseURL: 'http://192.168.3.3:9004/',
  timeout: 30 * 1000
})

inst.interceptors.response.use(
  res => {
    return res.data
  },
  err => Promise.reject(err)
)

const urls = {
  table: 'table',
  rules: 'rules',
  plan: {
    list: 'plans',
    post: 'plan',
    get: 'plan'
  }
}

export async function getTable(day_from_today = 1) {
  return inst.get(urls.table, { params: day_from_today })
}

export async function getHistoryTable(day_from_today = 2, shop_id, interval = 7) {
  return inst.get(urls.table, { params: { day_from_today, shop_id, interval } })
}

export async function getRules() {
  return inst.get(urls.rules)
}

export async function getPlans(shop_id) {
  return inst.get(`${urls.plan.get}/${shop_id}`)
}

export async function postPlan(oid, name, q, a) {
  return inst.post(urls.plan.post, { oid, name, q, a })
}
