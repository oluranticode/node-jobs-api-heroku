const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');
//  password hash
const bcrypt = require('bcryptjs');

const register = async(req, res) => {
   //  const {name, email, password} = req.body;
   //  if(!name || !email || !password){
   //     throw new BadRequestError('Please provide all neccessary details');
   //  }

   // ........Hash Password.............
   const {name, email, password} = req.body;
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(password, salt);
   const tempUser = {name, email, password:hashPassword}
   const user = await User.create({...tempUser});
   res.status(StatusCodes.CREATED).json({user});
}

const login = async(req, res) => {
   res.send('user login')
}

module.exports = {
    register, login
}