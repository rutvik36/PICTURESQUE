const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const path = require('path');
var multer  = require('multer');
const fs = require('fs');
const mongoose = require("mongoose");
const md5 = require("md5");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://admin-rutvik:rutvik123@cluster0-7bz7h.mongodb.net/picDB",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false})
//mongoose.connect("mongodb://localhost:27017/picDB",{useNewUrlParser:true,useUnifiedTopology: true});
Picschema = mongoose.Schema({
  user_name:String,
  insta_id:String,
  pic_info:{
    pic_name:String,
    image:String,
    caption:String
  }
});
AdminSchema= new mongoose.Schema({
  name:String,
  password:String});

  //AdminSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields:["password"]});
  const Admin = new mongoose.model("Admin",AdminSchema);
const Pic =mongoose.model("Pic",Picschema);
var Storage =multer.diskStorage({
  destination:"public/uploads/",
  /*filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }*/
});
var upload = multer({ storage:Storage});
/*app.listen(3000,function(){
  console.log("Server has started");
});*/
app.listen(process.env.PORT || 4000,function(){
  console.log("Server is running");
})

app.get("/",function(req,res){
  res.render("index");
});
app.get("/upform",function(req,res){
  res.render("upform");
});
app.get("/login",function(req,res){
  //console.log("login");

  fs.readdir('public/uploads/', (err, files) => {
            if (err) console.log(err);
            for (const file of files) {
                fs.unlink(path.join('public/uploads/', file), err => {
                    if (err) {console.log(err);}
                    else{
                      //console.log("deleted  all successfully");
                    }
                });
            }
        });
  res.render("login");
});
app.post("/login",function(req,res){


  var r=[];
  const name = req.body.uname;
  const pass = md5(req.body.password);
  /*let admin = new Admin({
    name:name,
    password:pass
  });
  admin.save(function(err){if(!err){res.render("success",{result:"Admin Added"});}});*/
  Admin.findOne({
    name:name
  }, function(err, admin) {
    if (err) {
      console.log(err);
    } else {
      if (admin) {
        if (admin.password == pass) {

          Pic.find({}, function(err, pic){
            if(!err){
              pic.forEach(function(p){
               var n=p.pic_info.pic_name;
               //console.log(n);
                var image=  Buffer.from(p.pic_info.image,'base64');
                var j=fs.writeFileSync('public/uploads/'+n,image);
                 r.push(p);
                 //console.log(pic);
             });

           }

           //console.log(r.length);
           setTimeout(function() {res.render("imgdis",{name:r});},2000);
          });




        }
        else{
          res.render("success",{result:"Wrong Password"});
        //  height:50%;
          //width:50%;
        }
      }
    }
  });
});
app.post("/imgdis",function(req,res){

  id=req.body.del_id;
  var n;
  var query = { _id: id };
  console.log(id);
  Pic.findById(id, function (err, product) {
     n=product.pic_info.pic_name.toString();
     //console.log(n);
     fs.unlink('public/uploads/'+n, (err) => {
       if (err) {
         console.error(err)
         return
       }
       else{
         //console.log("file removed successfully");
       }

       //file removed
     });
});

  Pic.deleteOne(query, function (err, result) {

        if (err) {

            console.log("error query");

        } else {

          //  console.log("successfully deleted");
res.render("success",{result:"Successfully Deleted"});

        }

    });
  /* */
});
app.post("/upform",upload.single('image'), function (req, res, next){
  var inp1=req.body.name;
  var inp2=req.body.instaid;
  var inp3=req.body.image;
  var inp4=req.body.caption;
  //console.log(req.file.filename);

  var img=fs.readFileSync(req.file.path);
  //console.log(img);
  var enc_img = img.toString('base64');
  var final_img={
    contentType:req.file.mimetype,
    path:req.file.path,
    image:  Buffer.from(enc_img,'base64')
  };
  let pic = new Pic({
    user_name:inp1,
    insta_id:inp2,
    pic_info:{
      pic_name:req.file.fieldname+"_"+Date.now()+path.extname(req.file.originalname),
      image:enc_img,
      caption:inp4
    }
  });
  pic.save(function(err){
    if(!err)
    {
    //  console.log("saved successfully");
    }
  });
//console.log(req.file.fieldname);
//console.log(path.extname(req.file.originalname))
  //console.log(final_img.image);
  fs.readdir('public/uploads/', (err, files) => {
            if (err) console.log(err);
            for (const file of files) {
                fs.unlink(path.join('public/uploads/', file), err => {
                    if (err) {console.log(err);}
                    else{
                      //console.log("deleted  all successfully");
                    }
                });
            }
        });

  /*fs.unlink('uploads/', (err) => {
  if (err) {
    console.error(err)
    return
  }
  else{
    console.log("file removed successfully");
  }

  //file removed
})*/
/**/


  //res.render("imgdis",{img:j});
  res.render("success",{result:"Successfully Uploaded"});
  console.log(inp1,inp2,inp3);
});
