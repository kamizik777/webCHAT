$(function () {
  const MAX_DISPLAYED_MESSAGES = 30;
  const socket = io();
  socket.nickname = "";
  let isLogged = false;

  $("#form").keypress(function (e) {
    if (e.keyCode === 13) {
      if(isLogged == false){
        $("#mensagens").hide()
        $("#form").hide().appendTo(".areamsg").slideDown(500);
        $("#msg").focus();
        
        
        
      }else{
        $("#mensagens").show()
      $("#form").appendTo(".areamsg");
      $("#msg").focus();
    }
    }
  } );

  $("#form").submit(function (evt) {
    evt.preventDefault();
    $("#msg").attr("placeholder", "Envie sua mensagem");
    if (!isLogged) {
      socket.nickname = $("#msg").val();
      
      socket.emit("login", socket.nickname);
      $("#msg").val("");
      isLogged = true;
      return false;
    }
    if ($("#msg").val() !== "") {
      const tamanhoMaximo = 50;
      const message = $('#msg'). val();
      socket.emit("chat msg", message);
      $("#msg").val("");
    }
    return false;
  });

  function scrollToBottom() {
    const $container = $(".card-body");
    $container.scrollTop($container[0].scrollHeight);
  }

  socket.on("chat msg", function (obj) {
    console.log(socket.nickname, obj);
    if ((socket.nickname == obj.nome)) {
      $("#mensagens").append($('<p class="enviado"></p>').text(obj.msg));
    } else {
      $("#mensagens").append($('<p class="recebido">').text(obj.msg));
    }
    scrollToBottom();
  });

  const $messages = $("#mensagens p");
  if ($messages.length > MAX_DISPLAYED_MESSAGES) {
    $messages.last().remove();
  }

  socket.on("status", function (msg) {
    $("#status").html(msg);
  });
});