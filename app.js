const express = require("express");
const bodyParser = require("body-parser");
const app = express();



// Telling our app to use ejs
// Documentation => gitHub, EJS with expresJs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// Global variables:
let itemsarray = [];
let workTasks = [];

// HOME PAGE GET/POST application
app.get("/", (req, res) => {

  // storing the day of week in a variable
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var today = new Date();
  var day = today.toLocaleDateString("en-US", options); // E.G. Saturday, September 17, 2016

  // Express is going to look inside a folder called views and it's going to look
  // for a file that's called list and it has the extension of ejs.
  // passing single variable and value as an object
  res.render("list", {
    pageTitle: day,
    items: itemsarray,
  });
});


// gets data from form, and pass after doing logic stuff redirect it
app.post('/', (req, res) => {
  let item = req.body.toDo;

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
