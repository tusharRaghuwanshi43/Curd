const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String,required: true, },
    email: { type: String, required: true, },
    phone: { type: String, required: true, },
    id: { type: String, required: true, },
    age: { type: String, required: true, },
    salary: { type: String, required: true, },
    joining_date: { type: String, required: true, },
    created: { type: Date, required: true, default: Date.now, }
});
module.exports = mongoose.model('User', userSchema);
