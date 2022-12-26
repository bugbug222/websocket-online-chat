/**
 * 启动聊天的服务端程序
 */
var users = []
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
server.listen(3000,()=>{
    console.log('服务器启动了')
})
//把public目录设置为静态资源目录
app.use(require('express').static('public'))
app.get('/',function(req,res){
    res.sendFile('/index.html')
})
io.on('connection',function(socket){
    //用户登录
    socket.on('login',data=>{
        

        //判断，如果data的用户在users中存在，说明用户已经登录了，不允许登录
        //如果data在users中不存在说明用户没有登录，允许用户登录
        let user = users.find(item => item.username === data.username)
        if(user){
            //表示用户存在，登录失败，服务器告诉浏览器登录失败
            socket.emit('loginError',{msg:'登录失败了捏'})
            console.log('登录失败')
        }else{
            //表示用户不在users中
            users.push(data)
            //通知浏览器
            socket.emit('loginSuccess',data)
            console.log('登录成功')
            //通知所有用户有人加入了群聊
            io.emit('addUser',data)
            //告诉所有的用户目前的聊天室有多少人
            io.emit('userList',users)
            //把登录成功的用户名和头像存储起来
            socket.username = data.username
            socket.avatar = data.avatar
        }
    })
    //用户断开连接
    socket.on('disconnect',()=>{
        //把当前的用户信息从users中删除  查找下标
        let idx = users.findIndex(item=>item.username === socket.username)
        //删除断开连接的人
        users.splice(idx,1)
        //通知所有用户有人离开了聊天室
        io.emit('delUser',{
            username:socket.username,
            avatar:socket.avatar
        })
        //userList发生变化
        io.emit('userList',users)
    })
    //用户聊天
    socket.on('sendMessage',data=>{
        //广播给所有用户
        io.emit('receiveMessage',data)
    })
    //获取到客户端发送的图片

    socket.on('sendImage',data=>{
        //广播给所有用户
        io.emit('receiveImage',data)
    })
})
