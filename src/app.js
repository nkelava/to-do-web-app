
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require("../modules/date");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


// ---- DATABASE ----
mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });

const itemsSchema = {
    name: { type: String }
};

const Item = mongoose.model("Item", itemsSchema);

// Item.insertMany([
//     {
//         name: "Welcome to your to-do list!"
//     },
//     {
//         name: "Hit the + button to add a new item."
//     },
//     {
//         name: "<-- Hit this to delete an item."
//     }
// ], function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Sucessfully saved default items to database.");
//     }
// });

// ------------------

app.get("/", function(req, res) {
    Item.find({}, function(err, tasks) {
        if(err) {
            console.log(err);
        } else {
            res.render("list", { 
                listTitle: date.getDate(),
                tasks: tasks
            });
        }
    });
});

app.post("/", function(req, res) {
    const { newItem, list } = req.body;
    let redirectPath = (list === "Work") ? "/work" : "/";

    if(newItem.length > 0) {
        if (list === "Work") {
            workTasks.push(newItem);
        } else {
            tasks.push(newItem);    
        }
    }
    
    res.redirect(redirectPath);
});


app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", tasks: workTasks });
});

app.listen(3000, function() {
    console.log("Server is listening on port 3000.");
});
