//jshint esversion:6


//  ------------------ requirements ------------------
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
var _ = require('lodash');

// Telling our app to use ejs
// Documentation => gitHub, EJS with expresJs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



// -------------- setting up magnoose----------------
// connecting mongoose to database
mongoose.connect("mongodb://localhost:27017/todolistDB");

// schema of each document
const itemsSchema = {
  name: String
}

const listTitleSchema = {
  title : String,
  // Send data as array of object/s
  data : [itemsSchema]
}

// model for mongoose
const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listTitleSchema);

// ------------------ Plane data-----------------
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




// -------------------- Application -----------------

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
        console.log(results);
    // renders data from DB
         res.render("list", {
           pageTitle: day,
           items: results,
         });
       };
    });
});

//  Dynamic render
app.get("/:listTitle", (req, res)=>{

  const listTitle = req.params.listTitle;

  List.findOne({title: listTitle}, (err, result)=>{
if(!err){
    if(result){
      console.log(result);
      res.render('list', {
        pageTitle: result.title,
        items: result.data
      });
    }else{
      const newPage = new List({
        title : listTitle,
        data: defaultItems
      });

      newPage.save();
      res.redirect(`/${listTitle}`);

    };
  }else{
    console.log(err);
  }

  });




});


// gets data from form, and pass after doing logic stuff redirect it
app.post('/', (req, res) => {
  let item = req.body.toDo;



  const newItem = new Item({
    name: item
  });

newItem.save();
res.redirect('/');

});



app.post("/delete", (req, res)=>{
  const deleteItemId = req.body.checkbox;

  Item.findByIdAndRemove(deleteItemId, function(err){
    if(!err){
      console.log("Successfully deleted check");
    }else{
      console.log(err);
    }
  });
  res.redirect('/');
});




// -------------------- Functions -----------------

app.listen(3000, () => {
  console.log("Server started on port 3000")
});
