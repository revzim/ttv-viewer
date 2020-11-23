/* revzim | this base was an old electron 'skeleton' of mine */
var app = new Vue({
  el: "#app",
  router,
  data: {
    strings: {
      name: "ttv-viewer",
      id: "ttv-viewer.app",
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

    window.onunload = (ev)=>{
      const app_data = JSON.parse(localStorage.getItem("app.init"));
      app_data.exited = {
        date: new Date(),
        timestamp: Date.now(),
      };
      if (!app_data.sessions) app_data.sessions = {};
      const session_data = JSON.parse(sessionStorage.getItem("app.session"));
      if (session_data) {
        app_data.sessions[Date.now()] = {
          key: session_data.session_key,
          count: session_data.count,
        };
      }
      localStorage.setItem("app.init", JSON.stringify(app_data));
    }

    api.send("toMain", btoa(JSON.stringify({
      key: "api.init",
      data: {},
    })));
    
    api.receive("fromMain", data=>{
      // console.log(JSON.parse(atob(data)));
      let jdata = JSON.parse(atob(data));
      // console.log("jdata:", jdata);
      let key = jdata.key;
      
      switch(key) {
        case "app.go.home":
          window.location.href = jdata.data;
          break;
        case "api.init.resp":
          if (typeof Storage !== "undefined") console.log("STORAGE FOUND!");
          if (localStorage.length == 0) {
            localStorage.setItem("app.init", JSON.stringify({
              t_create: Date.now(),
              app: this.strings.id,
              count: 1,
            }));
          } else {
            if (localStorage.getItem("app.init") && !sessionStorage.getItem("app.session")) {
              const app_data = JSON.parse(localStorage.getItem("app.init"));
              app_data.count++;
              localStorage.setItem("app.init", JSON.stringify(app_data));
              console.log(`opened app: ${app_data.count} times.`);
            }
          }
          if (!sessionStorage['app.session']) {
            sessionStorage['app.session'] = JSON.stringify({
              t_create: Date.now(),
              app: this.strings.id,
              session_key: `${Date.now()}_${Math.floor(Math.random() * 800) + 200}`,
              count: 1,
            })
          } else {
            const session_data = JSON.parse(sessionStorage.getItem("app.session"));
            session_data.count++;
            sessionStorage.setItem("app.session", JSON.stringify(session_data));
            console.log(`session has loaded ${session_data.count} times.`);
          }
           
          // sessionStorage.setItem("app.session", JSON.stringify({
          //   t_create: Date.now(),
          //   app: this.strings.id,
          //   sesion_key: `${Date.now()}_${Math.floor(Math.random() * 800) + 200}`
          // }));
          if (data.error) console.log("err:", jdata.data.error);
          const extensions = jdata.data.ext;
          extensions.forEach(ext=>{
            console.log(`${ext.name} successfully loaded.`);
          })
          break;
        default:
          console.log("unhandled key:", key, data);
          break;
      }
    });
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