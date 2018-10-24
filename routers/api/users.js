const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Load Register validation
const validateRegisterInput = require('../../validation/register');
//Load Login validation
const validateLoginInput = require('../../validation/login');

// Load User schema
const User = require('../../models/User');
const keys = require('../../config/keys');


// @route   POST api/users/register
// @desc    Register users route
// @access  Public
router.post('/register',(req,res)=>{
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid){
    return res.status(400).json(errors)
  }

  User.findOne({email:req.body.email})
      .then((user)=>{
        if(user){
          errors.email='Email aleady exists';
          return res.status(400).json({email:errors.email})
        }else{

          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
          })

          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user=>res.json(user))
                .catch(err=>console.log(err));

            })

          })
        }
      })
})

// @route   POST api/users/login
// @desc    Login User / Returning Token
// @access  Public
router.post('/login', (req,res) =>{
  const email=req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);


  User.findOne({email}).then(user=>{
    //Validate email and password
    if (!isValid)
      return res.status(404).json(errors)
    //Check for user
    if(!user){
      errors.email='User not found';
      return res.status(404).json(errors);
    }
    //Check password
    bcrypt.compare(password,user.password).then(isMatch => {
      if(isMatch){
        //User Matched
        const payload={
          id:user.id,
          name:user.name,
          //avatar:user.avatar
        }
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {expiresIn:3600 },
          (err,token)=>{
            res.json({
              success:true,
              token: 'Bearer '+token
            })}
          )}
        else {
          errors.password = 'Passwrod incorrect';
        return res.status(400).json(errors)
      }
    })

  })
})



module.exports = router;