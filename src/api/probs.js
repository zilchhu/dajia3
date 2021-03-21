import instance, { urls } from './base'

export default class Probs {
  constructor() {}

  single(key) {
    return instance.get(urls.probs.base(key))
  }

}
