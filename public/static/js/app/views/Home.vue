<style>
  #streamer-input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color:#fff;
  opacity: 1; /* Firefox */
  }
  button {
    color: #fff!important;
  }
</style>

<template>
  
  <div class="container text-light rounded">
    <div class="alert-info p-3 rounded">
      <h1 class="text-light">{{strings.title}}</h1>
      <h3 class="text-light">{{strings.subtitle}}</h3>
    </div>
    
    <div class="container pb-5" >
      <div class="container" >
        <div class="row" v-show="bools.hover_out" >
          <input  class="form-control w-75 text-light" type="text" id="streamer-input" v-model="inputs.streamer" :placeholder="strings.placeholders.streamer" @keyup.enter="find_stream">
          <button class="btn form-control w-25" @click="find_stream">{{strings.btns.watch}}</button>
        </div>
      </div>
      <button class="btn form-control" @click="toggle_show_help">{{btns.show_help.label}}</button>
      <ul v-show="btns.show_help.show" class="list-group">
        <li class="list-group-item alert-info m-2 p-2" v-for="thelper in t_helpers" :key="thelper.key">
        <h5 class="text-light">{{thelper.title}}</h5>
        <p class="mb-1 text-light">{{thelper.subtitle}}</p>
        </li>
      </ul>
    </div>
    <br />
    <br />
    <br />
  </div>
</template>

<script>

/* revzim | this base was an old electron 'skeleton' of mine */
function Helper(key, title, subtitle) {
  this.key = key;
  this.title = title;
  this.subtitle = subtitle;
}

module.exports = {
  name: "Home",
  data: function() {
    return {
      ttv: {
        connected: false,
      },
      inputs: {
        streamer: "",
      },
      t_helpers: [
        new Helper("search", "Search", "Enter the streamer you want to watch into the search bar. Then hit your `enter` or tap the `watch` button."),
        new Helper("Login", "Login & Chat", "By default, you are not logged in. The first time you attempt to chat, you will be prompted to login. Feel free to login to your account and chat or just watch."),
        new Helper("extensions", "Included Extensions", "This application includes 3 chrome extensions: uBlock Origin, BTTV, and FFZ."),
        new Helper("server", "Packaged Server", "If you still prefer your browser, this app is packaged with a webapp/server. Go to: http://localhost:8085/ttv/<streamer> and replace <streamer> with the broadcaster.")
      ],
      btns: {
        show_help: {
          label: "I NEED HELP!",
          show: false,
        }
      },
      strings: {
        title: "ttv-viewer",
        subtitle: "watch twitch ad-free, with ffz & bttv",
        btns: {
          watch: "watch",
        },
        placeholders: {
          streamer: "search for a streamer here...",
        }
      },
      bools: {
        stream_loaded: false,
        hover_out: true,
      }
    };
  },
  methods: {
    find_stream() {
      if (this.inputs.streamer.length < 3) return;
      document.querySelector('body').classList.remove('maximize');
      api.send("toMain", btoa(JSON.stringify({
        key: "query.ttv.stream",
        data:{
          streamer: this.inputs.streamer,
        }
      })));
    },
    toggle_show_help() {
      this.btns.show_help.show = !this.btns.show_help.show;
      this.btns.show_help.show ? this.btns.show_help.label = "THANKS FOR THE HELP" : this.btns.show_help.label = "I NEED HELP!";
    },

  },
  mounted() {
    init_controls();
    
    window.api.receive("fromMain", data=>{
      const jdata = JSON.parse(atob(data));
      switch(jdata.key) {
        case "btn.max":
          document.body.classList.add('maximized');
          break;
        case "btn.restore":
          document.body.classList.remove('maximized');
          break;
        default:
          break;
      }
    })
  },
};
</script>


