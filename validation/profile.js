const validator = require('validator');
const isEmpty =require('./isEmpty');

function validateProfileInput(data){
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.description = !isEmpty(data.description) ? data.description: '';

   if(!validator.isLength(data.handle,{min:2, max:40})){
    errors.handle = "Handle needs to between 2 and 4 character";
  }

  if(validator.isEmpty(data.handle)){
    errors.handle = "Profile handle is required";
  }

  if(!validator.isLength(data.description,{min:20, max:100})){
    errors.description = "Description needs to between 20 and 100 characters";
  }

  if(validator.isEmpty(data.description)){
    errors.description = "Description is required";
  }

  return {
    errors:errors,
    isValid: isEmpty(errors)
  }
}

module.exports =  validateProfileInput;