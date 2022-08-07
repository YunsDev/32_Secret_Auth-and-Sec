require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app= express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine' , 'ejs');


//-----------------------
mongoose.connect("mongodb://localhost:27017/userDB");
// const userSchema= {
//   email: String,
//   password: String
// }

const userSchema= new mongoose.Schema({
  email: String,
  password: String
});


const User= mongoose.model("User", userSchema);
app.get("/", function(req,res){
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.post("/register", function(req,res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const newUser= User({
          email: req.body.username,
          password: hash
        })

          newUser.save(function(err){
            if(!err){
              res.render('secrets');
            }else{
              console.log(err);
            }
          });

  });
});

app.post("/login", function(req,res){
    const email= req.body.username;
    const password= req.body.password;

    User.findOne({email: email}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          bcrypt.compare(password, foundUser.password, function(err, result) {
              if(result == true){
                  res.render("secrets");
              }
          });
        }
      }
    });

});

app.listen(3000, function(){
  console.log('Server started on port 3000');
})
