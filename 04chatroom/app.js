const ws = require('nodejs-websocket')


//记录当前的连接数
let count =0
//创建服务
//conn是每个连接到服务器的用户，都给一个用户名
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2
const server = ws.createServer(conn =>{
   
    console.log("新连接")
    //连接数+1
    count++ 
    conn.username = `用户${count}`
    //1、告诉每个用户有人加入了聊天室
    //传入一个消息对象
    //type：消息的类型    0：表示进入聊天室的消息  1：用户离开聊天室的消息   2：正常的聊天消息
    //msg：消息的内容   time：聊天的时间
    broadcast({
        type: TYPE_ENTER,
        msg: `${conn.username}进入聊天室`,
        time: new Date().toLocaleTimeString()
    })
    //接收到客户端的消息
    conn.on('text',data=>{
        //2、当接收到了某个用户的信息的时候，告诉所有用户发送的消息的内容是什么
        console.log("接收到客户端的消息"+data)
        broadcast({
            type: TYPE_MSG,
            msg: data,
            time:new Date().toLocaleTimeString()
        })
    })
    //关闭连接的时候触发
    conn.on('close',()=>{
        console.log("关闭连接")
        count--
        
        //3、有人离开告诉所有的人离开消息
        broadcast({
            type: TYPE_LEAVE,
            msg: `${conn.username}离开了聊天室`,
            time:new Date().toLocaleTimeString()
        })
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
        conn.send(JSON.stringify(msg))
    })
}