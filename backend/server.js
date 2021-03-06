const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");
const { remove } = require("./models/Todo");

mongoose.connect("mongodb://mongodb:27017/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true });

mongoose.connection.once("open", () => {
  console.log("Mongodb connection established successfully");
});



const PORT = 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});



app.post("/create", (req, res) => {
  console.log("Creating a todo...");
  console.log(req.body);
  const todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

app.post("/:id", (req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err, todo) => {
    if (!todo) {
      res.status(404).send("Todo not found");
    } else {
      todo.text = req.body.text;

      todo
        .save()
        .then((todo) => {
          res.json(todo);
        })
        .catch((err) => res.status(500).send(err.message));
    }
  });
});

app.delete("/remove/:id", (req, res)=>{
  console.log("Trying to remove...");
  const id = req.params.id;
  Todo.findByIdAndRemove(id, err =>{
    if(err)
      return res.status(404).send("Todo not found");
    res.json({success: "true"});
  })
})

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
