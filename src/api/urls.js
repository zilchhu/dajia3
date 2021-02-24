const urls = {
  user: {
    base(username, date) {
      return `/user/${username}/${date}`
    },
    acts(username, date) {
      return `/user_acts/${username}/${date}`
    }
  },
  date: 'date',
  sum: {
    base(date) {
      return `/sum/${date}`
    }
  },
  fresh_shop: '/fresh',
  shop: {
    base(shopid) {
      return `/shop/${shopid}`
    },
    history(shopid) {
      return `/shop_history/${shopid}`
    },
    shops(platform) {
      return `/shops/${platform}`
    },
    real: '/shops/real',
    addNewShop: '/addNewShop',
    addFengniao: '/addFengniao'
  },
  plan: {
    multi: 'plans'
  },
  fresh: {
    mt: '/fresh/mt',
    elm: '/fresh/elm'
  },
  perf: {
    base(date = 31) {
      return `/perf/${date}`
    }
  },
  tests: {
    sync: '/tests/sync',
    del: '/tests/del'
  }
}

export default urls
