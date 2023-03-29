const Io = require('socket.io');
const SshClient = require('ssh2').Client;
const fs = require('fs');

module.exports = (server) => {
  var io = new Io(server)
  io.on('connection', (socket) => {

    var sshClient = new SshClient();
    sshClient.on('ready', () => {
      sshClient.shell({}, (err, stream) => {
        if (err)
          return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');

        socket.on('data', d => stream.write(d));

        stream.on('data', d => {
          socket.emit('data', d.toString());
        });
        stream.on('close', () => {
          sshClient.end();
          socket.disconnect();
        });
        stream.stderr.on('data', d => {
          console.log('STDERR: ' + data)
        });
      });
    }).on('close', () => {
      socket.disconnect();
    }).on('error', (err) => {
      socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
    }).connect({
      // ssh用の設定
      host: 'ホストを指定',
      port: 22,
      username: 'ユーザ名を指定',
      privateKey: fs.readFileSync('pemファイルを指定')
    });
  });

  return io;
}