## ttv-viewer

### ttv-viewer - a simple electron app to enjoy twitch ad-free with bttv & ffz integration

[latest release exe installer](https://github.com/revzim/ttv-viewer/releases/download/0.0.13/ttv-viewer.Setup.0.0.13.exe)

![HOME](https://i.imgur.com/ogNkhvz.png)
![VIEWER_0](https://i.imgur.com/1xjWM3r.png)
![VIEWER_1](https://i.imgur.com/5Ktix99.png)
![VIEWER_2](https://i.imgur.com/PsnAqzz.png)

[ALBUM](https://imgur.com/a/rBLHGEa)

## install
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

## BUILD
* all:
  yarn dist or npm run dist
* windows:
  * yarn distw or npm run distw
* mac
  * yarn distm or npm run distm
* linux
  * yarn distl or npm run distl


## included extensions 
* [ublock origin](https://github.com/gorhill/uBlock) *
* [bttv](https://github.com/night/betterttv)
* [ffz](https://github.com/FrankerFaceZ/FrankerFaceZ)

#### disclaimer
* built on windows 10 (amd)
* extensions not provided within this repo.

#### author: revzim
