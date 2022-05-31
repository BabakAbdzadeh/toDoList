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
  name: String
}

// model for mongoose
const Item = mongoose.model('Item', itemsSchema);

//  creating data for our model
const item1 = new Item({
  name: "wake up early"
});
const item2 = new Item({
  name: "Go to the library"
});
const item3 = new Item({
  name: "Sleep in the library"
});

const defaultItems = [item1, item2, item3];


// Global variables:
let itemsArray = [];
let workTasks = [];



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
  Item.find((err, results)=>{
// avoids duplication
    if(results.length === 0){
      // Adds data to DB
      Item.insertMany(defaultItems, (err) =>{
        if(err){
           console.log(err)
         }else{
           console.log('Success in saving data to DB')};
      });
      // !! this code is inside if
      // redirect to the main route again, otherwise data will not show up on the page because of if statement
      res.redirect("/");
    }else{
    // renders data from DB
         res.render("list", {
           pageTitle: day,
           items: results,
         });
       };
    });
});


app.get('/delete', (req, res)=>{});


// gets data from form, and pass after doing logic stuff redirect it
app.post('/', (req, res) => {
  let item = req.body.toDo;

  const newItem = new Item({
    name: item
  });

newItem.save();
res.redirect('/');

  // using recieved value from button to decide which page gonna get the data
  // if(req.body.submit === "Work"){
  //   workTasks.push(item);
  //   res.redirect("/work");
  // }else{
  //   console.log(req.body.submit);
  //   itemsArray.push(item);
  //   // Important to redirect, otherwise it waits on pending!
  //   res.redirect("/");
  // }
});



app.post("/delete", (req, res)=>{
  const deleteItemId = req.body.checkbox;
  Item.deleteOne({id : deleteItemId}, (err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("successfuly deleted");
    }
  });
  res.redirect('/')
});

// Work PAGE GET
// One app post is enough for both pages
app.get("/work", (req, res) => {
  res.render("list", {
    pageTitle: "Work To Do!",
    items: workTasks
  });
})


app.listen(3000, () => {
  console.log("Server started on port 3000")
});
