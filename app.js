//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const mongoose = require("mongoose");

url = "mongodb+srv://MozamilS:Nahbus%40123@cluster0.jui5z.mongodb.net/BlogDB2"

mongoose.connect(url, {useNewURLParser:true}, function(err){
  if (err){
    console.log(err)
  } else{
    console.log("Connection Successful")
  }
})


PostSchema = mongoose.Schema({
  title: String,
  post: String
})

Post = mongoose.model("Post", PostSchema)


const homeStartingContent = "Click on Compose from the menu above to make your post.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
  Post.find(function(err, Posts){
    if (err){
      console.log(err)
    } else {
      res.render("home", {content_one: homeStartingContent , posts:Posts})

    }
  })
})

app.get("/about", function(req,res){
  res.render("about", {content_one: aboutContent})
})

app.get("/contact", function(req,res){
  res.render("contact", {content_one: contactContent})
})

app.get("/compose", function(req,res){
  res.render("compose")
})

function first_function(_callback){
  _callback()
}

app.post("/compose", function(req, res){
  const post = req.body.compose_post;
  const title = req.body.compose_title;

  var submit = true

  Post.find({title:title}, function(err, Posts){
    if (err){
      console.log(err)
    } else {
      if (title.length == 0 || title.length > 50) {
        console.log("The title must be between 0 and 50 characters")
        submit = false;
      }
      
      if(post.length == 0 || post.length > 500){
        console.log("The post must be between 0 and 500 characters")
        submit = false; 
      }
      
      if(Posts.length == 0 && submit == true){
        console.log("Submittion initiated")
        const new_post = new Post({
        title: title,
        post: post
        })

        new_post.save()
        res.redirect("/")
      }else {
        res.redirect("/compose")
      }
    }
  })


  


  
})

app.get("/posts/:Paramaribo", function(req,res){

  Post.find(function(err, Posts){
    if (err){
      console.log(err)
    } else {
      let found = false

      for (let i = 0; i < Posts.length; i++){
        if (_.lowerCase(Posts[i].title) == _.lowerCase(req.params.Paramaribo)){
          res.render("post", {title:Posts[i].title, post:Posts[i].post})
          found = true;
          break;
        }
      }
      if (found == false){
        res.render("post", {title:"Error", post:"Status 404: Post not found"} )
      }
      
      
    }
  })
  
})






app.listen(process.env.PORT || 3000, function() {
  console.log("Journling App initiated");
  console.log(process.env.PORT || 3000)
});
