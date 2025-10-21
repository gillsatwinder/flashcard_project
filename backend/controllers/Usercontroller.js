

const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../database/userdatabase.json")

//Read current data

function readdata(){
  const data = fs.readFileSync(filePath);
  return JSON.parse(data)
}

// write current data
function writedata(user){
  fs.writeFileSync(filePath,JSON.stringify(user, null, 2));
}

// Function to handle signup logic
function Usersignup(data) {
  const { username, email, password, confirmPassword} = data;

  if (!username || !email || !password || !confirmPassword) {
    return { success: false, message: "All fields are required." };
  }
  if(password !== confirmPassword){
    return{ success: false, message: "Password mismatched!!"}
  }

  const checkuser = readdata();
  const userfound=  checkuser.find(olduser => olduser.email === email);

  if (userfound) {
    return { success: false, message: "User already exists." };
  }

  checkuser.push({ username, email, password });
  writedata(checkuser);
  return { success: true, message: "Signup successful!" };
}



// Function to handle signin logic
function Usersignin(data) {
  const { email, password } = data;
  const checkuser= readdata();

  const foundUser = checkuser.find(user => user.email === email && user.password === password);
  if (!foundUser) {
    return { success: false, message: "Invalid credentials." };
  }

  return { success: true, message: "Login successful!" };
}

// Export the logic so other files can use it later
module.exports = { Usersignup, Usersignin };
