const mongoose = require('mongoose');

const userSchema =  new mongoose.Schema({
    first_name : {
        type: String,
        require: true
    },
    surname : {
        type: String,      
    },
    email : {
        type: String,
        unique: true,
        require: true      
    },
    password : {
        type: String,
        require: true 
    },
    date_of_birth : {
        type: String,
    }
},
 {timestamps:true}
);



module.exports = mongoose.model('User',userSchema);