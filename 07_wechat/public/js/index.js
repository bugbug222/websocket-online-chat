
/**
 * 聊天室的主要功能
 */



//1、连接websocket
var socket = io('http://localhost:3000')
//定义当前的用户和头像
var username ,avatar
/**
 * 2、登录功能，选择头像
 */
//给选中的头像添加class属性，没选中的同级属性去除class属性
$('#login_avatar li').on('click',function(){
  $(this).addClass('now').siblings().removeClass('now')
})

$('#loginBtn').on('click',function(){
  //获取用户名
  var username = $('#username').val().trim()
  if(!username){
    alert("请输入用户名!")
    return;
  }
  //获取选中的头像
  var avatar = $('#login_avatar li.now img').attr('src')
  console.log(username,avatar)
  //发送给服务器
  socket.emit('login',{
    username:username,
    avatar: avatar
  })
})
//监听服务器登录的请求
socket.on('loginError',data=>{
  alert(data.msg)
})
socket.on('loginSuccess',data=>{
  $('.login_box').fadeOut()
  $('.container').fadeIn()
  //将data个人数据显示出来
  $('.avatar_url').attr('src',data.avatar)
  $('.header .username').text(data.username)
  username = data.username
  avatar = data.avatar
})
//监听用户加入群聊
socket.on('addUser',data=>{
  console.log(data)
  $('.box-bd').append(`
          <div class="system">
            <p class="message_system">
              <span class="content">${data.username}加入了群聊</span>
            </p>
          </div>
          `)
          scrollIntoView()
})
//监听用户列表
socket.on('userList',data=>{
  $('.user-list ul').html('')
  data.forEach(item => {
    $('.user-list ul').append(`
      <li class="user">
            <div class="avatar"><img src="${item.avatar}" alt="" /></div>
            <div class="name">${item.username}</div>
          </li> 
    `)
  });
  $('#userCount').text(data.length)
})
//监听用户离开聊天室
socket.on('delUser',data=>{
  console.log(data)
  $('.box-bd').append(`
          <div class="system">
            <p class="message_system">
              <span class="content">${data.username}离开了群聊</span>
            </p>
          </div>
          `)
    scrollIntoView()
})
//聊天发送消息到服务器
$('.btn-send').on('click',()=>{
  //获取聊天的内容
  var msg = $('#content').html()
  console.log("content:::::" + msg +"ppp" )
  //清空输入框
  $('#content').html('')
  if(!msg) return alert("请输入内容再发送")
  //发送给服务器
  socket.emit('sendMessage',{
    msg:msg,
    username: username,
    avatar: avatar
  })
})
//监听聊天
socket.on('receiveMessage',data=>{
  //把接受到消息显示到聊天窗口中
  if(data.username === username){
    //自己的消息
    $('.box-bd').append(`
      <div class="message-box">
            <div class="my message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="bubble">
                  <div class="bubble_cont">${data.msg}</div>
                </div>
              </div>
            </div>
          </div>
    `)
  }else{
    //别人的消息
    $('.box-bd').append(`
    <div class="message-box">
    <div class="other message">
      <img class="avatar" src="${data.avatar}" alt="" />
      <div class="content">
        <div class="nickname">${data.username}</div>
        <div class="bubble">
          <div class="bubble_cont">${data.msg}</div>
        </div>
      </div>
    </div>
    `)
  }
  scrollIntoView()
})
//每次有最新的消息都会滚动到最后一条消息的最底部
function scrollIntoView(){
    $('.box-bd').children(':last').get(0).scrollIntoView(false)
  }
//发送图片功能
$('#file').on('change',function(){
  var file = this.files[0]
  //需要把这个图片发给服务器  ，借助H5新增的fileReader
  var fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = function(){
    socket.emit('sendImage',{
      username:username,
      avatar:avatar,
      img:fr.result
    })
  }
})
//监听图片聊天信息
//监听聊天
socket.on('receiveImage',data=>{
  //把接受到消息显示到聊天窗口中
  if(data.username === username){
    //自己的消息
    $('.box-bd').append(`
      <div class="message-box">
            <div class="my message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="bubble">
                  <div class="bubble_cont">
                    <img src="${data.img}">
                  </div>
                </div>
              </div>
            </div>
          </div>
    `)
  }else{
    //别人的消息
    $('.box-bd').append(`
    <div class="message-box">
    <div class="other message">
      <img class="avatar" src="${data.avatar}" alt="" />
      <div class="content">
        <div class="nickname">${data.username}</div>
        <div class="bubble">
          <div class="bubble_cont">
            <img src="${data.img}">
          </div>
        </div>
      </div>
    </div>
    `)
  }
  //等待图片加载完成再滚动
  $('.box-bd img:last').on('load',function(){
    scrollIntoView()
  })
  
})
//发送图片
$('.face').on('click',function(){
  $('#content').emoji({
    button:'.face',
    position: 'topRight',
    showTab: true,
    animation: 'fade',
    icons: [
      {
        name: 'qq表情',
        path: '../lib/jquery-emoji/img/qq/',
        maxNum: 91,
        excludeNums: [41,45,54],
        file: '.gif',
        placeholder: '#qq_{alias}#'
      }

    ]
  })
})