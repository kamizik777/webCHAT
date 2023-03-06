

const express = require("express");

const app = express();

app.use(express.static("public"));


const http = require("http").Server(app);
const serverSocket = require("socket.io")(http);

const porta = 8000;

http.listen(porta, function () {
  console.log(
    "Servidor iniciado. Abra o navegador em http://localhost:" + porta
  );
});

app.get("/", function (req, resp) {
  resp.sendFile(__dirname + "/index.html");
  
});




serverSocket.on("connection", function (socket) {
  
  socket.on("login", function (nickname) {
    const objLogin = {
      nome: nickname,
      msg: `Usuário ${nickname} conectou`
    }
    serverSocket.emit("chat msg", objLogin);
    socket.nickname = nickname;
    
  });

  socket.on("chat msg", function (msg) {

    const obj = {
      nome: socket.nickname,
      msg: msg
    }

    console.log(`Msg recebida do cliente ${obj.nome}: ${obj.msg}`);
    
    if(obj.msg !== "" && obj.msg !== " "){
      serverSocket.emit("chat msg", obj);
    }
    
    
  });

  socket.on("status", function (msg) {
    socket.broadcast.emit("status", msg);
  });
});
