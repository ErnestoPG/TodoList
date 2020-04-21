const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash')

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/todolistDB' ,{useNewUrlParser:true,useUnifiedTopology:true});

//Siempre debajo del app=express//
app.set("view engine", "ejs");

const itemsSchema = new mongoose.Schema({
  name:String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:"Welcome to a new ToDo List."
});
const item2 = new Item({
  name:"<-- Mark here to delete items."
});
const item3 = new Item({
  name:"Watch the markets!"
});

const defaultItems = [item1,item2,item3];

const listSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const List = mongoose.model("List" , listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, docs){

    if(docs.length===0){

        Item.insertMany(defaultItems, function(err) {
          if (err){
            console.log(err);
          } else {
            console.log("Succesfully added to collection!");
            }
        });
        res.redirect("/");
      } else{
        res.render("list", {listTitle: "Today" ,newListItems: docs});
      }
  });
});


app.post("/", function(req,res){
  const itemName = req.body.newItem;
  const listName=req.body.list;

const item = new Item({
  name:itemName
});

if(listName==="Today"){
  item.save();
  res.redirect("/");
} else {
  List.findOne({name:listName}, function(err,foundList){
    //item se refiere al schema.
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  });
}
});

app.post("/delete", function(req,res){
checkedItemId=req.body.checkbox
listName=req.body.listName;

if(listName==="Today"){
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err){
      console.log("ITEM DELETED.");
      res.redirect("/");
        }
      });
  }else {
      List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkedItemId}}}, function(err,foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });

  }
});


app.get("/:listsCustom", function(req,res){
  const listNameCustom = _.capitalize(req.params.listsCustom);

  List.findOne({name:listNameCustom},function(err,foundList){
    if (!err){
      if(!foundList){
        //Create a new list
        const list = new List({
          name:listNameCustom,
          items:defaultItems
        });

      list.save();
      res.redirect("/" + listNameCustom);

      } else {
        //show and existing list
        res.render("list", {listTitle:foundList.name, newListItems:foundList.items})
      }
    }
  });


});


app.post("/work " , function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function(req,res){
  res.render("about");
})


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
