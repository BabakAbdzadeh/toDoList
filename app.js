const express = require("express");
const bodyParser = require("body-parser");
 const app = express();

// Telling our app to use ejs
// Documentation => gitHub, EJS with expresJs
app.set('view engine', 'ejs');


 app.get("/", (req, res)=>{


   // storing the day of week in a variable
   const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
   const d = new Date();
   let day = weekday[d.getDay()];




   // Express is going to look inside a folder called views and it's going to look
   // for a file that's called list and it has the extension of ejs.
   // passing single variable and value in an object
   res.render("list", {kindOfDay: day});



 });



 app.listen(3000, ()=>{
   console.log("Server started on port 3000")
 });
