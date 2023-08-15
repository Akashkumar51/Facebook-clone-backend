const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema =  new mongoose.Schema({
    comment : {
        type: String,
    },
    
    reply : {
        type: String,     
    },
    user_id: {type: Schema.Types.ObjectId, require:true, ref: "User"}
},
 {timestamps:true}
);



module.exports = mongoose.model('Post',userSchema);