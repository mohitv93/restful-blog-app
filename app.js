var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


//APP-Config
mongoose.connect("mongodb://localhost:27017/restful_blogv2", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));



//Mongoose Model Schema//
var blogSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        body: String,
        created:{type: Date, default: Date.now}
        
    });
    
    var Blog = mongoose.model("Blog", blogSchema);
    
//RESTful Routes//
app.get("/", function(req,res){
   res.redirect("/blogs"); 
});
//INDEX ROUTE//
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, data){
       if(err){
           console.log("error");
       } else{
           res.render("index", {data: data});
       }; 
    });
});
//NEW ROUTE//
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE//
app.post("/blogs", function(req, res){
   //create blogs
    Blog.create(req.body.blog, function(err, blog){
       if(err){
           console.log("Error");
       } else{
           res.redirect("/blogs");
       }
    });
});

//SHOW ROUTE//
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, viewBlog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("show", {idata: viewBlog});
       }
    });
});

//EDIT ROUTE//
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, editblog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit", {edit: editblog});
       };
   }); 
});
//UPDATE ROUTE//
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" +req.params.id);
        };
    });
});

//DELETE ROUTE//
app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err, deleted){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs");
      };
   }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started");
});