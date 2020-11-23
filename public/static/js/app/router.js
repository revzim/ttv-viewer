/* revzim | this base was an old electron 'skeleton' of mine */
Vue.use(VueRouter)

const routes = [
  { path: '/', component: httpVueLoader("./js/app/views/Home.vue") },
]

const router = new VueRouter({
  routes: routes,
})

router.afterEach((to, from) => {
  switch (to.path) {
    case "/" || "/home":
      console.log("Moved to home")
      break;
    default:
      console.log("Unhandled route")
      break;
  }
  let toHash = to.path.substring(1, to.path.length)
  if (toHash === '') {
    toHash = "home"
  }
  let fromHash = from.path.substring(1, from.path.length)
  if (fromHash === '') {
    fromHash = 'home'
  }
  document.querySelector("#navlinkitem-" + fromHash).classList.remove("active")
  document.querySelector("#navlinkitem-" + toHash).classList.add("active")
})
