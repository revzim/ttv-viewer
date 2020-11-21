/* revzim | this base was an old electron 'skeleton' of mine */
var app = new Vue({
  el: "#app",
  router,
  data: {
    strings: {
      name: "TTV Viewer",
      id: "ttv.ad.less",
      version: "",
      lversion: "",
      ping: "",
      start_date: 1605990503,
    },
    bools: {
      nav: false,
    },
    navlinks: [
      new NavLink("home", "Home", "/")
    ],
  },
  methods: {
  },
  created: function () {

  },
  mounted() {
  },
})
function NavLink(key, title, route) {
  return {
    key: key,
    title: title,
    route: route,
  }
}
function Section(key, title, subtitle) {
  return {
    key: key,
    title: title,
    subtitle: subtitle,
  }
}