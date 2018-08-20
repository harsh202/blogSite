var bodyParser = require("body-parser");
var express = require("express");
var expressSanitizer=require("express-sanitizer");
var methodOverride= require("method-override");
var app = express();
var mongoose = require("mongoose");

mongoose.connect("mongodb://harsh:2053350579hH@ds153851.mlab.com:53851/codemeharsh");

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// app.use(expressSanitizer);
app.use(methodOverride("_method"));


var BlogSchema = mongoose.Schema({
    title:String,
    image: String,
    body:String,
    creation:{ type: Date, default: Date.now },
})
var Blog = mongoose.model("Blog",BlogSchema);
app.get("/",function(req,res){
    res.redirect("/blogs");
})

app.get("/blogs", function(req,res){

    Blog.find({},function(err,blogs){
        if(err){
            console.log("an error occured")
        }
        else{
            res.render("index",{blogs:blogs})
        }
    })
})
app.get("/blog/new", function(req,res){
    res.render("new");
})
app.get("/blogs/:id", function(req,res){
    let id = req.params.id;
    Blog.findById(id,function(err,foundBlog){
        if(err){
            console.log("an error occured");
            res.redirect("/blogs")
        }
        else{
            res.render("show",{blog:foundBlog})
        }
    })
})
app.get("/blogs/:id/edit",function(req,res){
    let id = req.params.id;
    Blog.findById(id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog})
        }
    })
})
app.put("/blogs/:id",function(req,res){
    // let id = req.params.id;
    // req.body.blog.body =req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})
app.post("/blogs", function(req,res){
    // req.body.blog.body =req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log("there is an error");
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
// Blog.create({
//     title:"this is the first title",
//     image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/West_Indian_whistling_duck_%28Dendrocygna_arborea%29_head.JPG/300px-West_Indian_whistling_duck_%28Dendrocygna_arborea%29_head.JPG",
//     body:"this is the Body"
// })

app.listen(3002,function () {
        console.log("SERVER IS LOADED");
})