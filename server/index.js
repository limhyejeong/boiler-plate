const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require("./middleware/auth")
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))



app.get('/', (req, res) => res.send('hello world!~~'))


// LandingPage 에서 요청이 오면 
app.get('/api/hello', (req, res) => {
  res.send("안녕하세요 ~ ")
})


app.post('/api/users/register', (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client 에서 가져오면 그것들을 데이터베이스에 넣어줌

  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})



// 로그인 기능
app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {

    // 해당 유저가 없을 때
    if (!user) { 
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 해당 유저가 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      // 비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {

        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키 
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})



// 페이지이동 및 글작성 시 로그인 유무와 권한 체크
app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 것
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})



// 로그아웃 기능
app.get('/api/users/logout', auth, (req, res) => {

  // 유저를 찾아서 정보를 업데이트
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" } // 토큰 지우기
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})


const port = 5000


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})