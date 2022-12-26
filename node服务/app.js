const ws = require('nodejs-websocket')
const PORT = 3000
//创建一个server
const server = ws.createServer(connect =>{
    console.log("有用户连接上来了")
    //服务端返回数据
    connect.on('text',data=>{
        console.log("接收到客户端的数据"+data)
        connect.send(data.toUpperCase()+"!!")
    })
    connect.on('close',()=>{
        console.log("连接断开了")
    })
    connect.on('error',()=>{
        console.log("用户连接异常   ")
    })
})
server.listen(PORT,()=>{
    console.log("websocket服务启动了，监听了"+PORT+"端口")
})