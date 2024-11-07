const usersStorage = require("../storages/usersStorage");
// This just shows the new stuff we're adding to the existing contents
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
];

const validateEmail = [
  body("email")
  .isEmail().withMessage("Email is invalid")
  .notEmpty().withMessage("Email cannot be empty dumbass")
]

const validateAge = [
  body("age")
  .isInt({ min: 18, max: 120 }).withMessage(val => { 
    return val < 18 
    ? "If you're dumb enough to tell you're real age you're probably not old enough to see this page get out" 
    : "Enter a valid age asshole"
  })]

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  validateEmail,
  validateAge,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio }); // email won't get inserted? 
    res.redirect("/");
    console.log(usersStorage.getUsers())
  }
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersGetByName = (req, res) => {
  const { searchTerm } = req.query
  console.log(searchTerm)
  const filteredElements = usersStorage.getUsersWithFirstName(searchTerm)
  res.render("searchResults", { filteredElements })
  // res.redirect("/search") throws an error because its being redirected 2 times
}

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  validateEmail,
  validateAge,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio }); // email won't get inserted? 
    res.redirect("/");
  }
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};