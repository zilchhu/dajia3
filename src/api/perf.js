import instance, { urls } from './base'

export default class Perf {
  constructor(date = 31) {
    this.date = date
  }

  single() {
    return instance.get(urls.perf.base(this.date))
  }
}
