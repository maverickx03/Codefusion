const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://code_ide:code_pass@codeide.jvaga.mongodb.net/?retryWrites=true&w=majority&appName=CodeIDE', {
    serverSelectionTimeoutMS : 20000,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error))

let userSchema = new mongoose.Schema({
    name: String,
    username : String,
    email: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    },
    isBlocked: {
        type: Boolean,
        default: false,
        
    },
    isAdmin: {
        type: Boolean,
        default : false
    }

});

module.exports = mongoose.model('User', userSchema);