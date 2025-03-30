const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://code_ide:code_pass@codeide.jvaga.mongodb.net/?retryWrites=true&w=majority&appName=CodeIDE");

const projectSchema = new mongoose.Schema({
    title: String,
    createdBy: String,
    date: {
        type: Date,
        default: Date.now
    },
    cCode: {
        type : String,
        default: "#include<stdio.h>"
    },
    cppCode:{
        type: String,
        default: '//comment'
    },
    python:{
        type: String,
        default : "#some comment"

    },
    jsCode:{
        type: String,
        default: 'JS COde'
    }
});

module.exports = mongoose.model("Project", projectSchema);