<style>
  #streamer-input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color:#fff;
  opacity: 1; /* Firefox */
  }

  .modal-dialog {
    max-width: 100%!important;
    width: 100%!important;
    height: 100%!important;
    background: #282828;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  #vid  {
    width:200vh!important;
    height:80vh!important;
  }

</style>
<template>
  
  <div class="container-large-desktop">
    <h1 class="alert-info text-light">
      {{strings.title}}
      <br />
      {{strings.subtitle}}
    </h1>
    <webview id="vid" class="modal-dialog m-1 bg-dark" v-show="bools.stream_loaded" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko" plugins></webview>
    <br />
    <div class="container pb-5" >
      <div class="container" >
        <div class="row" v-show="bools.hover_out" >
          <input  class="form-control w-75 text-light" type="text" id="streamer-input" v-model="inputs.streamer" :placeholder="strings.placeholders.streamer" @keyup.enter="find_stream">
          <button class="btn form-control w-25" @click="find_stream">{{strings.btns.watch}}</button>
        </div>
      </div>
      <button class="btn form-control" @click="toggle_show_help">{{btns.show_help.label}}</button>
      <ul v-show="btns.show_help.show" class="list-group">
        <li class="list-group-item list-group-item-primary m-2 p-2" v-for="thelper in t_helpers" :key="thelper.key">
        <h5>{{thelper.title}}</h5>
        <p class="mb-1">{{thelper.subtitle}}</p>
        </li>
      </ul>
      <div class="indicator" ></div>
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
        subtitle: "ttv-viewer.",
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
    modal_view() {
      /*
        this.$modal.show(
        {
          template: `
          <webview id="vid" class="modal-dialog m-1 bg-dark" :src="url" useragent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"></webview>`,
            props: ['url'],
          },
          { url: url },
          { height: '90%', resizable: true, width: "90%", adaptive: true, draggable: true, scrollable: true, focusTrap: true,},
          { 'before-close': event => {} 
        });
        console.log(this.$modal);
      */
    },
    find_stream() {
      if (this.inputs.streamer.length < 3) return;
      // const url = `http://localhost:8085/ttv/${this.inputs.streamer}`;
      // window.location.href = url;
      // document.querySelector("#vid").src = url;
      api.send("toMain", btoa(JSON.stringify({
        key: "query.ttv.stream",
        data:{
          streamer: this.inputs.streamer,
        }
      })));
      // const webview = document.querySelector('webview');
      // const indicator = document.querySelector('.indicator');
      // webview.src = url;
      // const loadstart = () => {
      //   this.bools.stream_loaded = false;
      //   indicator.innerText = `attempting to load ${this.inputs.streamer}'s stream.`;
      // }
      // const loadstop = () => {
      //   indicator.innerText = '';
      //   this.bools.stream_loaded = true;
      //   // this.show();
      // }
      // console.log("WEBVIEW:", webview);
      // webview.addEventListener('did-start-loading', loadstart);
      // webview.addEventListener('did-stop-loading', loadstop);
    },
    hover_toggle(toggle) {
      this.bools.hover_out = toggle;
      if (toggle) {
        
      } else {

      }
    },
    toggle_show_help() {
      this.btns.show_help.show = !this.btns.show_help.show;
      this.btns.show_help.show ? this.btns.show_help.label = "THANKS FOR THE HELP" : this.btns.show_help.label = "I NEED HELP!";
    },
    // show () {
    //   this.$modal.show('my-first-modal');
    // },
    // hide () {
    //   this.$modal.hide('my-first-modal');
    // }
  },
  mounted() {

    // const webview = document.querySelector('webview');
    // window.onresize=function(){
    //   webview.width=window.innerWidth;
    //   webview.height=window.innerHeight;
    // };
  },
};
</script>

<style>
</style>
