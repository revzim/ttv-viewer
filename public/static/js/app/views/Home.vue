<style>
  #streamer-input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color:#fff;
  opacity: 1; /* Firefox */
}
</style>
<template>
  
  <div class="text-center">
    <h1 class="alert-info text-light jumbotron">
      {{strings.title}}
      <br />
      {{strings.subtitle}}
    </h1>
    <div class="container">
      <div class="row">
        <input class="form-control w-75 text-light" type="text" id="streamer-input" v-model="inputs.streamer" :placeholder="strings.placeholders.streamer" @keyup.enter="find_stream">
        <button class="btn form-control w-25" @click="find_stream">{{strings.btns.watch}}</button>
      </div>
    </div>
    <ul class="list-group">
      <li class="list-group-item bg-dark text-light m-2 p-2" v-for="helper in helpers" :key="helper.key">
      <b class="display-4">{{helper.title}}</b>
      <br />
      <b class="lead">{{helper.subtitle}}</b>
      </li>
    </ul>
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
      helpers: [
        new Helper("search", "Search", "Enter the streamer you want to watch into the search bar. Then hit your `enter` or tap the `watch` button."),
        new Helper("Login", "Login & Chat", "By default, you are not logged in. The first time you attempt to chat, you will be prompted to login. Feel free to login to your account and chat or just watch."),
        new Helper("server", "Packaged Server", "This application does not include extensions; However, it is packaged with a webapp/server. If you `need` bttv/ffz extensions, head to http://localhost:8085/ttv/<streamer>. <streamer>= streamer you want to watch.")
      ],
      strings: {
        title: "TTV Viewer",
        subtitle: "Watch twitch without ads, for now.",
        btns: {
          watch: "watch",
        },
        placeholders: {
          streamer: "search for a streamer here...",
        }
      },
      bools: {}
    };
  },
  methods: {
    find_stream() {
      if (this.inputs.streamer.length < 3) return;
      const url = `http://localhost:8085/ttv/${this.inputs.streamer}`;
      window.location.href = url;
    }
  },
  mounted() {
  },
};
</script>

<style>
</style>
