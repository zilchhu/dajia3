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

  shops(platform) {
    return instance.get(urls.shop.shops(platform))
  }

  real() {
    return instance.get(urls.shop.real)
  }

  addNewShop(data) {
    return instance.post(urls.shop.addNewShop, data)
  }

  addFengniao(data) {
    return instance.post(urls.shop.addFengniao, data)
  }

  delFengniao(data) {
    return instance.post(urls.shop.delFengniao, data)
  }

  fengniao() {
    return instance.get(urls.shop.fengniao)
  }

  prob(type, platform) {
    return instance.get(urls.shop.prob.base(type, platform, this.shopid))
  }

  order(platform, activi, counts) {
    return instance.get(urls.shop.order.base(this.shopid, platform), { params: { activi, counts } })
  }
}
