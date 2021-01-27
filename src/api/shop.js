import instance, { urls } from './base'

export default class Shop {
  constructor(shopid) {
    this.shopid = shopid
  }

  single() {
    return instance.get(urls.shop.base(this.shopid))
  }

  single_history(oneday) {
    return instance.get(urls.shop.history(this.shopid), { params: { oneday } })
  }
}
