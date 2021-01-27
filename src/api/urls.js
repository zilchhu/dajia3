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
  shop: {
    base(shopid) {
      return `/shop/${shopid}`
    },
    history(shopid) {
      return `/shop_history/${shopid}`
    }
  },
  plan: {
    multi: 'plans'
  },
  fresh: {
    mt: '/fresh/mt'
  },
  tests: {
    sync: '/tests/sync',
    del: '/tests/del'
  }
}

export default urls
