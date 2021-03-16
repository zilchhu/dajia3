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
    },
    sum2: '/sum2'
  },
  fresh_shop: {
    base: '/fresh',
    saveA: '/saveFreshA',
    as: '/freshas'
  },
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
    addFengniao: '/addFengniao',
    fengniao: '/fengniao',
    delFengniao: '/delFengniao',
    addDada: '/addDada',
    dada: '/dada',
    delDada: '/delDada',
    addMyt: '/addMyt',
    myt: '/myt',
    delMyt: '/delMyt',
    prob: {
      base(type, platform, shopId) {
        return `/prob/${type}/${platform}/${shopId}`
      }
    },
    order: {
      base(id, platform) {
        return `/order/${platform}/${id}`
      }
    },
    indices: {
      base(platform, shopId, day) {
        return `/indices/${platform}/${shopId}/${day}`
      }
    }
  },
  change: {
    base() {
      return '/shopActsDiff'
    },
    save() {
      return '/saveShopActsDiff'
    }
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
  },
  expo: {
    perf(date) {
      return `/绩效表${date}`
    }
  }
}

export default urls
