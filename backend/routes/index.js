var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel")
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
var projectModel = require("../models/projectModel")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const secret = "secret";


router.post("/signUp", async (req,res) =>{
  let {username, name, email, password} = req.body;
  let emailCon = await userModel.findOne({email:email});
  if(emailCon){
    return res.json({success: false, message: "Email aLready exists!"});
  }
  else {

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        let user = userModel.create({
          username:username,
          name: name,
          email:email,
          password:hash
        });
    
        return res.json({success: true, message: "User created Successfully"});
      });
  });
    
  }
})

router.post("/login", async (req,res)=>{
  let {email, password} = req.body;
  let user = await userModel.findOne({email: email});
  if(user){
  bcrypt.compare(password, user.password, function (err, isMatch){
    if(isMatch){
      console.log("Logged In")
      let token = jwt.sign({email: user.email , userId: user._id}, secret);
      return res.json({success: true, message: "User logged in Successfully",token:token, userId:user._id});
    }
    else {
      return res.json({success: false, message: "Invalid email or Password"});
    }
  });
}
else{
  return res.json({success: false, message: "User not Found"});
}
});

router.post("/getUserDetails", async(req,res) => {
  console.log("called")
  let {userId} = req.body;
  let user = await userModel.findOne({_id: userId});
  if(user){
    return res.json({ success : true, message:"User details fetched successfully", user : user})
  }else{
    return res.json({success : false, message: "User not found!"});
  }
});

router.post("/createProject", async (req, res) => {
  let {userId, title} = req.body;
  let user = await userModel.findOne({_id: userId});
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });

    return res.json({success : true, message: "Project created successfully", projectId : project._id })
  }else{
    return res.json({success : false, message: "User not Found!", projectId : project._id })
  }
})

router.post("/getProjects", async (req, res) => {
  let { userId} = req.body;
  let user = await userModel.findOne({_id: userId});
  if(user) {
    let projects = await projectModel.find({createdBy : userId});
    
    return res.json({ success : true, message : "Projects fetched successfully", projects : projects});
  }
  else{
    return res.json({ success: false, message: "User not found!"});
  }

});

router.post("/deleteProjects", async(req, res) =>{
  let {userId, projId} =  req.body;
  let user = await userModel.findOne({_id : userId});
  if(user){
    let project = await projectModel.findOneAndDelete({_id : projId});
    return res.json({success : true, message: "Project deleted successfully"});
  }
  else {
    return res.json({ success: false, message: "User not found!"})
  }
});

router.post("/getProject", async  (req, res) =>{
  let {userId, projId} = req.body;
  let user = await userModel.findOne({_id: userId});
  if (user) {
    let project = await projectModel.findOne({_id : projId});
    return res.json({ success: true, message: "Project fetched successfully", project : project});

  }
  else{
    return res.json({ success: false, message: "User not found", project : project});
  }
});


router.post("/updateProject", async (req,res) =>{
  let {userId, cCode, cppCode, jsCode,python, projId} = req.body;
  let user = await userModel.findOne({ _id: userId});
  if(user){
    let project = await projectModel.findOneAndUpdate({_id : projId}, {cCode, cppCode, python, jsCode},{new: true});  
    return res.json({success: true, message: "Project updated Successfully"});
  }
  else{
    return res.json({success: false, message: "User Not found!"});
  }
});


router.post("/runCode", async (req, res) => {
  const { language, code, input } = req.body;

  const encodedCode = Buffer.from(code).toString("base64");
  const encodedInput = Buffer.from(input || "").toString("base64");

  const payload = {
      source_code: encodedCode,
      language_id: getLanguageId(language),
      stdin: encodedInput,
  };

  try {
      const response = await fetch("https://judge029.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "x-rapidapi-key": "3708298537mshb541a05c1693f01p1e320ejsn56f2ff9fb48c",
              "x-rapidapi-host": "judge029.p.rapidapi.com"
          },
          body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Judge0 Response:", data);

      if (data.status && data.status.description !== "Accepted") {
          return res.json({ error: data.status.description });
      }

      // Decode the Base64 output before sending it to frontend
      const decodedOutput = data.stdout ? Buffer.from(data.stdout, "base64").toString("utf-8") : "";
      const decodedError = data.stderr ? Buffer.from(data.stderr, "base64").toString("utf-8") : "";

      res.json({ output: decodedOutput, error: decodedError });
  } catch (error) {
      console.error("Execution Error:", error);
      res.status(500).json({ error: "Failed to execute code" });
  }
});

function getLanguageId(lang) {
  const languageMap = {
      "C": 50,
      "Cpp": 54,
      "js": 63,
      "python": 71,
  };
  return languageMap[lang] || 71; // Default to Python
}

module.exports = router;
