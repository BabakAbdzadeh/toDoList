//  importing modules
const mongoose = require("mongoose");

// connecting mongoose to database
mongoose.connect("mongodb://localhost:27017/todolistDB");

// schema of each document
const itemsSchema = {
  name: String
}

// model for mongoose
const Item = mongoose.model('Item', itemsSchema);

//  creating data for our model
const item1 = new Item({
  name: "waking up early"
});
const item2 = new Item({
  name: "Eat breakfast"
});
const item3 = new Item({
  name: "Go to library"
});
const item4 = new Item({
  name: "Sleep in the library"
});

const defaultItems = [item1, item2, item3, item4];

//  Be careful about amount of times using it

// Item.insertMany(defaultItems,(err) =>{
//   if(err){
//     console.log(`There is an error: ${err}`)
//   }else{
//     console.log("Everything is fine")
//   }
// } );

module.exports = {Item};
