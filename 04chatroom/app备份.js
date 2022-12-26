const ws = require('nodejs-websocket')


//记录当前的连接数
let count =0
//创建服务
//conn是每个连接到服务器的用户，都给一个用户名
const server = ws.createServer(conn =>{
   
    console.log("新连接")
    //连接数+1
    count++ 
    conn.username = `用户${count}`
    //1、告诉每个用户有人加入了聊天室
    broadcast(`${conn.username}进入了聊天室`)
    //接收到客户端的消息
    conn.on('text',data=>{
        //2、当接收到了某个用户的信息的时候，告诉所有用户发送的消息的内容是什么
        console.log("接收到客户端的消息"+data)
        broadcast(data)
    })
    //关闭连接的时候触发
    conn.on('close',()=>{
        console.log("关闭连接")
        count--
        broadcast(`${conn.username}离开了聊天室`)
        //3、有人离开告诉所有的人离开消息
    })
    //关闭时触发的异常
    conn.on('error',()=>{
        console.log("发生异常")
    })
})
server.listen(3000,()=>{
    console.log("监听3000端口")
})
//广播给所有用户
function broadcast(msg){
    server.connections.forEach(conn=>{
        conn.send(msg)
    })
}