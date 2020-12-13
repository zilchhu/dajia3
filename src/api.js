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
  table: 'table'
}

export async function getTable(day_from_today = 1) {
  return inst.get(urls.table, { params: day_from_today })
}

export async function getHistoryTable(day_from_today = 2, shop_id, interval = 7) {
  return inst.get(urls.table, { params: { day_from_today, shop_id, interval } })
}
