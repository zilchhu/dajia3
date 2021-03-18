import instance, { urls } from './base'

export default class Notes {
  base() {
    return instance.get(urls.notes.base)
  }

  save(key, title, description, content, images) {
    return instance.post(urls.notes.save, {
      key,
      title,
      description,
      content,
      images
    })
  }

  delete(key) {
    return instance.post(urls.notes.del, {
      key
    })
  }
}
