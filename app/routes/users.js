var express = require('express')
var router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const withAuth = require('../middlewares/auth')
require('dotenv').config()
const secret = process.env.JWT_TOKEN

router.post("/register", async (req, res) => {
  const {name,email,password} = req.body
  const user = new User({name,email,password})
  try {
    await user.save()
    res.json(user).status(200)
  } catch (error) {
    res.status(500).json({error: "Error registering new User"})
  }
})

router.post("/login", async(req, res) => {
  const {email,password} = req.body
  try {
    let user = await User.findOne({email})
    if(!user){
      res.status(401).json({error: "Incorrect email or password"})
    }else {
      user.isCorrectPassword(password, function (err,same){
        if(!same)
          res.status(401).json({error: "Incorrect email or password"})
        else {
          const token = jwt.sign({email}, secret, {expiresIn: '10d'})
          res.json({user: user, token: token})
        }
      })
    }
  } catch (error) {
    res.status(500).json({error: "Internal Error, please try again"})
  }
})

router.put("/edit",withAuth, async(req, res) => {
  const{name,email} = req.body
  try {
    var user = await User.findOneAndUpdate(
      {_id: req.user._id},
      {$set: {name : name , email : email}},
      {'new': true}
    )
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(401).json({error: error})
  }
})

router.put("/password", withAuth, async (req, res) => {
  const{password} = req.body
  try {
    const user = await User.findOne({_id: req.user._id})
    user.password = password
    user.save()
    res.json(user)
  } catch (error) {
    res.status(401).json({error:error})
  }
})

router.delete('/', withAuth, async (req,res) => {
  try {
    let user = await User.findOne({_id: req.user._id})
    await user.delete()
    res.json({message:'ok'}).status(200)
  } catch (error) {
    res.status(500).json({error})
  }
})

module.exports = router