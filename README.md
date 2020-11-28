## ttv-viewer

### ttv-viewer - a simple electron app to enjoy twitch ad-free with bttv & ffz integration

### [installers](https://github.com/revzim/ttv-viewer/releases)

![HOME](https://i.imgur.com/qC5TFWA.png)
![VIEWER_0](https://i.imgur.com/1xjWM3r.png)
![VIEWER_1](https://i.imgur.com/5Ktix99.png)
![VIEWER_2](https://i.imgur.com/PsnAqzz.png)

## view & install from source (0.0.13=current source)
* git clone https://github.com/revzim/ttv-viewer
* cd ttv-viewer
* npm install 
  * yarn
* RUN APPLICATION
  * npm run start
    * or yarn start
  * application will start
    *  ex: enter the streamer name into the search box then hit enter or tap 'watch'
  * and
  * a local server will spin up at localhost:8085
    * route `/ttv/<streamer>` where \<streamer\> = streamer to watch
  * [watch](http://localhost:8085/ttv/<streamer>)

## included extensions 
* [ublock origin](https://github.com/gorhill/uBlock) *
* [bttv](https://github.com/night/betterttv)
* [ffz](https://github.com/FrankerFaceZ/FrankerFaceZ)

#### disclaimer
* built on windows 10 (amd)
* extensions not provided within this repo.

#### author: revzim
