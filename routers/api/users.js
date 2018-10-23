const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Load Register validation
const validateRegisterInput = require('../../validation/register');

// Load User schema
const User = require('../../models/User');

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



module.exports = router;