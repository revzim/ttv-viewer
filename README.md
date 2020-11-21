## ttv-viewer

## ttv-viewer is a very simple electron application to enjoy twitch ad-free. it uses ttv-ad-less-standalone as it's main dependency.


![IMG](https://i.imgur.com/Z8E8fKP.png)
![IMG](https://i.imgur.com/rYs5VdB.png)

###### disclaimer: second image I cropped out stream name & gifters in the section of chat.

## install
* git clone https://github.com/revzim/ttv-viewer
* cd ttv-viewer
* npm install 
  * yarn
* RUN APPLICATION
  * npm run start
    * or yarn start
  * application will start
    *  ex: enter the streamer name into the search box then hit enter or tap 'watch'.
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


#### disclaimer
* built on windows 10 (amd)
* built on macos big sur

#### author: revzim
