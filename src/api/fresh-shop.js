import instance, { urls } from './base'

export default class FreshShop {
  single() {
    return instance.get(urls.fresh_shop)
  }
}
