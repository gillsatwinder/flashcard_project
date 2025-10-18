const { Usersignin, Usersignup } = require("./Usercontroller");

console.log(Usersignup({
  username: "Satwinder",
  email: "sat@mail.com",
  password: "12345",
  confirmPassword: "12345"
}));

console.log(Usersignin({
   email: "sat@mail.com",
  password: "12345",
}));