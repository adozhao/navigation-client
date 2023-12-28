import router from './router'
import store from './store'

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  const hasToken = store.state.user.token

  if (hasToken) {
    if (to.path === '/Login') {
      next({ path: '/home' })
    } else {
      await store.dispatch('user/getUserInfo')
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})