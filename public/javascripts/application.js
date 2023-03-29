 const term = new Terminal({
   cursorBlink: true, // カーソル点滅
   scrollback: 1000, // 最大表示行数
   cols: 200, // 最大列数
   rows: 50 // 最大行数
 });
 // 画面にterminalをアタッチ
 term.open(document.getElementById('#terminal'));
 // アドオンでフルスクリーン化
 term.toggleFullscreen();

 const socket = io();

 /**
  * 1文字入力される毎にsshで同期される。
  * ※)term.on('key')も同時に発火する為、注意
  */
 term.on('data', d => {
    socket.emit('data', d)
 });

 /**
  * 特定コマンドを検知する為、keypressイベントも使える。
  * ※) term.on('data')も同時に発火する為、注意
  */
 term.on('key', (key, e) => {
   // enter押下
   if (e.keyCode == 13) {
     // 現在入力行取得
     var line = term.rowContainer.children[term.buffer.y].textContent;
     // コマンドのみ取り出す
     var cmd = line.slice(line.indexOf('$') + 1).trim();
     // slコマンドだったらしゅっぽ！する
     if ('sl' == cmd) {
       alert('しゅっぽ！しゅっぽ！');
     }
   }
 });

 socket.on('data', d => term.write(d));

 /**
  * ページ遷移・更新時イベント
  */
 window.onbeforeunload = () => {
   // ssh接続される側にsessionが残らないように、logoutさせる。
   socket.emit('data', 'logout\r\n');
 };