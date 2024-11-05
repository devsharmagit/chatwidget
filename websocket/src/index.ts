import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {

  console.log("websocket server is going good")

  ws.send("everything working fine")

  ws.on('close', () => {
    console.log('close the server')
  });
});

console.log('done');