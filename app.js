// importing modules
const express = require("express");
const bodyParser = require("body-parser");
const {Item} = require("./db.js");
const mongoose = require('mongoose');



// Setting up the app
const app = express();

// Setting up the EJS for the application
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
// using static files with express
app.use(express.static("public"));

// Global variables:
let itemsarray = [];
let workTasks = [];


// Passing name properties from the DataBase model
Item.find((err,results)=>{
  results.forEach(result => {

    itemsarray.push(result.name);
  })
  console.log(itemsarray);
})


// HOME PAGE GET/POST application
app.get("/", (req, res) => {
// Using Date() module
  // storing the day of the week in a variable
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var today = new Date();
  // its possible to pass it to ejs file as an array of objects
  var day = today.toLocaleDateString("en-US", options); // E.G. Saturday, September 17, 2016

  // rendering list.ejs file
  res.render("list", {
    pageTitle: day,
    items: itemsarray,
  });
});


// gets data from the form, and pass after doing logic stuff redirect it
app.post('/', (req, res) => {
  // storing data submited from ejs file.
  var item = req.body.toDo;

  // using recieved value from button to decide which page gonna get the data
  if(req.body.submit === "Work"){
    workTasks.push(item);
    res.redirect("/work");
  }else{
    console.log(req.body.submit);
    itemsarray.push(item);
    // Important to redirect, otherwise it waits on pending!
    res.redirect("/");
  }
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
