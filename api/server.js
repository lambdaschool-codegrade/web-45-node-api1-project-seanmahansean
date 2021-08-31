// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model");

const server = express();
server.use(express.json())

server.get("/api/users", (req, res) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      res.status(500).json({
        message: "The user's information could not be retrieved",
        err: err.message
      })
    })
})

server.post("/api/users", (req, res) => {
  const user = req.body;
  if(!user.name || !user.bio){
    res.status(400).json({
      message: "Please provide name and bio for the user"
    })
  }else{
    User.insert(user)
      .then(nUser => {
        res.status(201).json(nUser)
      })
      .catch(err => {
        res.status(500).json({
          message: "There was an error while saving the user to the database",
          err: err.message
        })
      })
  }
})

server.get("/api/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if(!user){
        res.status(404).json({
          message: "The user with the specified ID does not exist"
        })
      }
      res.json(user)
    })
    .catch(err => {
      res.status(500).json({
        message: "The user information could not be retrieved",
        err: err.message
      })
    })
})

server.delete("/api/users/:id", async (req, res) => {
  try{
    const potentUser = await User.findById(req.params.id);
    if(!potentUser){
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    }else{
      const delUser = await User.remove(potentUser.id);
      res.status(200).json(delUser)
    }
  }catch(err){
    res.status(500).json({
      message: "The user could not be removed",
      err: err.message
    })
  }
})

server.put("/api/users/:id", async (req, res) => {
  try{
    const potentUser = await User.findById(req.params.id);
    if(!potentUser){
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    }else{
      if(!req.body.name || !req.body.bio){
        res.status(400).json({
          message: "Please provide name and bio for the user"
        })
      }else{
        const updUser = await User.update(req.params.id, req.body)
        res.status(200).json(updUser)
      }
    }
  }catch(err){
    res.status(500).json({
      message: "The user could not be removed",
      err: err.message
    })
  }
})

server.use("*", (req, res) => {
  res.status(404).json({
    message: "not found"
  })
})

module.exports = server;
