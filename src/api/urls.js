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
  shop: 'shop'
}

export default urls