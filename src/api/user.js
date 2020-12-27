import instance, { urls } from './base'

export default class User {
  constructor(username, date = 1) {
    this.username = username
    this.date = date
  }

  all_names() {
    return instance.get(urls.user.base(':all_names', this.date))
  }

  all() {
    return instance.get(urls.user.base(':all', this.date))
  }

  single() {
    return instance.get(urls.user.base(this.username, this.date))
  }
}
