const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');


// Telling our app to use ejs
// Documentation => gitHub, EJS with expresJs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



// connecting mongoose to database
mongoose.connect("mongodb://localhost:27017/todolistDB");

// setting up magnoose
// schema of each document
const itemsSchema = {
  name: String,
  type: String
}

const Item = mongoose.model('Item', itemsSchema);
// HOME PAGE GET/POST application
app.get("/", (req, res)=> {

  // storing the day of week in a variable
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var today = new Date();
  var day = today.toLocaleDateString("en-US", options); // E.G. Saturday, September 17, 2016

// getting data from DB
  Item.find({type:'toDo'},(err, results)=>{

    // renders data from DB
    res.render("list", {
          pageTitle: day,
          items: results,
         });
       });
});


// gets data from form, and pass after doing logic stuff redirect it
app.post('/', (req, res) => {
  let item = req.body.toDo;

  if(req.body.submit === "Work"){
    const newItem = new Item({
      name: item,
      type: "work"
    });
    newItem.save();
    res.redirect("/work");
  }else{

    const newItem = new Item({
      name: item,
      type: "toDo"
    });
    newItem.save();
    // Important to redirect, otherwise it waits on pending!
    res.redirect("/");

  };
});



app.post("/delete", (req, res)=>{
  var deleteItemName = req.body.checkbox;
  var typeOfItem = req.body.submitted;


if(typeOfItem === 'toDo'){

  Item.deleteOne({ name : deleteItemName}, (err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("successfuly deleted ");
    }
  });
  res.redirect('/')
}else{
  Item.deleteOne({ name : deleteItemName}, (err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("successfuly deleted ");
    }
  });
  res.redirect('/work')
}
});


// Work PAGE GET
// One app post is enough for both pages
app.get("/work", (req, res) => {

  Item.find({type:'work'},(err, results)=>{

    // renders data from DB
         res.render("list", {
           pageTitle: "Work to do!",
           items: results,
         });
    });
})


app.listen(3000, () => {
  console.log("Server started on port 3000")
});



// NO error handeling
// mongoose.Types.ObjectId(deleteItemName)
