
const express = require('express');
const app = express();

function initExpressApp() {
  app.use('/public', express.static(`${__dirname}/public`));
  
  app.get("/ttv/:streamer", (req, res) =>{
    res.setHeader("streamer", req.params.streamer);
    res.sendFile(`${__dirname}/public/ttv.html`);
  });
  
  const exit_events = [
    "beforeExit",
    "exit",
    "SIGTERM",
    "SIGINT",
  ];
  
  exit_events.forEach(ev=>{
    process.on(ev, (code) => {
      console.log(`PROCESS ${ev} | CODE: ${code}`);
      process.exit(0);
    });
  });
  
  app.listen(SETTINGS.port, () => {
    SETTINGS.app = app;
    console.log(`TTV-AD-LESS: http://${SETTINGS.host}:${SETTINGS.port}/ttv/:streamer`);
  });
}

const SETTINGS = {
  host: 'localhost',
  port: 8085,
  init: initExpressApp,
};

SETTINGS.init();