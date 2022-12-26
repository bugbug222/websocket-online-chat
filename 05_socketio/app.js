const http = require('http')
var fs = require('fs')
const app = http.createServer()
app.on('request',(req,res)=>{
    fs.readFile(__dirname+'/index.html',
    function(err,data){
        if(err){
            res.writeHead(500);
            return res.end('error loading index.html')
        }
        res.writeHead(200);
        res.end(data)
    })
})

app.listen(3000,()=>{
    console.log("服务器启动了")
})
const io = require('socket.io')(app)
//监听用户的连接事件
io.on('connection',socket=>{
    console.log('新用户连接了')
    socket.emit('send',{name:'zs'})
    socket.on('abc',data=>{
        console.log(data)
        socket.emit('send',data)
    })
    
})

