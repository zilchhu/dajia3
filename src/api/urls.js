const urls = {
  user: {
    base(username, date) {
      return `/user/${username}/${date}`
    }
  },
  date: 'date',
  shop: 'shop'
}

export default urls