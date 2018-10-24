const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Load Validation
const validationProfileInput = require('../../validation/profile.js');

const User = require('../../models/User.js');
const Profile = require('../../models/Profile.js')

// @route   GET api/profile/test
// @desc    Tests posts route
// @access  Public
router.get('/test',(req,res)=>res.json({msg:"Profile Works"}));


// @route   POST api/profile
// @desc    Create and Edit user profile
// @access  Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res) => {
  const { errors, isValid } = validationProfileInput(req.body);

  //Check Validation
  if(!isValid){
    //Return any erros with 400 status
    return res.status(400).json(errors);
  }

  //Get fields
  const profileFields={};
  profileFields.user=req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.description) profileFields.description = req.body.description;
  if(req.body.picture) profileFields.picture = req.body.picture;

  Profile.findOne({ user: req.user.id})
    .then(profile => {
      if(profile){
        //Update
        Profile.findOneAndUpdate(
          { user:req.user.id },
          { $set: profileFields},
          { new:true }
        ).then(profile => res.json(profile))
      } else {
        //Create

        //Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile =>{
          //if handle exist, response the error message
          if(profile){
            errors.handle =" That handle already exist";
            res.status(400).json(errors);
          }
         //if handle not exist, create a new profile;
          new Profile(profileFields).save().then(profile => res.json(profile));
        })
      }
    })
});


// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res) => {
  const errors={};
  Profile.findOne({user:req.user.id})
    .populate('user',['name','email'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})


// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all',(req,res) => {
  const errors={};
  Profile.find()
    .populate('user',['name','email'])
    .then(profiles => {
      if(!profiles || profiles.length===0){
        errors.noprofiles = 'There is no profile'
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({profile:'There is no profiles'}));
})

module.exports = router;