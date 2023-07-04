const net = require('net');
const client = net.createConnection({ port: 8080 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log('客户端：收到服务端响应数据为'+data.toString())
  client.end();
});
client.write('hello')
client.on('end',function(){
  console.log('断开与服务器的连接')
})