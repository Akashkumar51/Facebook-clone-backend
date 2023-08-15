const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const User = require('./Model/User')
const Post = require('./Model/Post')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');


const SecretKey = "AK12345";

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/uploads',express.static('uploads'))
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000" 
};
app.use("*", cors(corsOptions));
// app.use(cors())

const databaseserver = "127.0.0.1:27017"
const databasedb = "thoughtDB"

mongoose.connect(`mongodb://${databaseserver}/${databasedb}`)
  .then(() => console.log('Connected!'));

  app.get('/', function (req, res) {
    res.send('Hello World')
  })

 
app.post('/user-create', async function (req, res) {
  try {
    const userData = new User({
      first_name:req.body.first_name,
      surname:req.body.surname,
      email: req.body.email,
      password:req.body.password,
      date_of_birth:req.body.date_of_birth
  })
  const user = await userData.save();
  res.status(200).json({ message:"You successfully craeated your account", data:user});
    
  } catch (error) {
    res.status(401).json({ message:error});
  }
  
})

app.post('/user-comment', async function (req, res) {
  try {
    const userData = new Comment({
      comment:req.body.comment,
      reply:req.body.reply,
      user_id: req.body.user_id
      
  })
  const user = await userData.save();
  res.status(200).json({ message:"You successfully craeated your account", data:user});
    
  } catch (error) {
    res.status(401).json({ message:error});
  }
  
})

app.post('/post-create',upload.single('image'), async function (req, res) {
  console.log(req,70);
  try {
    const postData = new Post({
      title:req.body.title,
      subject:req.body.subject,
      image: req.file.path,
      user_id: req.body.user_id
  })

  const post = await postData.save();
  res.status(200).json({ message:"You successfully created your post", data:post});
    
  } catch (error) {
    res.status(401).json({ message:error});
  }
  
})


app.get('/all-posts', async function (req, res) {
  try {
    const posts = await Post.find().select("title subject image").populate("user_id" ,"first_name surname email").sort({"createdAt": -1})
    console.log(posts);
    res.status(200).json({ message:"You successfully created your posts", data:posts});
    
  } catch (error) {
    res.status(401).json({ message:error});
  }
  
})

app.get('/single-post/:id', async function (req, res) {
  try {
    const id = req.params.id
    console.log(id);
    const post = await Post.findById({_id:id})
    console.log(post);
    res.status(200).json({ data:post});
    
  } catch (error) {
    res.status(401).json({ message:error});
  }
  
})


app.post('/login', async function (req, res) {
  try {
    console.log(req.body);
   const finduser = await User.findOne({email:req.body.email,password:req.body.password}).select("email first_name surname date_of_birth")
   if (finduser === null) {
    res.status(200).json({ message:"User Not Found. Please Login .."});
   }else{
    const encryptData = jwt.sign(JSON.parse(JSON.stringify(finduser)),SecretKey,{expiresIn: "10m"})
    res.status(200).json({ message:"User Found.", data:encryptData});
   } 
    
  } catch (error) {
    console.log(error);
    res.status(200).json({ message:error});
    
  }
  
 })

 app.post('/token-verify', async function (req, res) {
  try {
    console.log(req.body);
    const decryptData= jwt.verify(req.body.token, SecretKey)
    res.status(200).json({ message:"decrypt Data.", data:decryptData});
  } catch (error) {
    res.status(200).json({ message:error});
  }
 })

const port = 8000
app.listen(port,() =>{
    console.log(`server running on this ${port}`);
})