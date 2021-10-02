const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {isLoggedIn,isUser, clearOriginalUrl,validateUser,validateRegistration} = require("../middleware");
const multer  = require('multer');
const users = require("../controllers/users");
const {storage} = require("../cloudinary");
const upload = multer({ storage });

router.route("/register")
    .get(users.renderRegisterForm)
    .post(clearOriginalUrl,validateRegistration, wrapAsync(users.createUser));

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}), users.loginUser);

router.get("/logout", clearOriginalUrl, users.logoutUser);

router.get("/profile/:id/edit",isLoggedIn,isUser, wrapAsync(users.renderProfileEditForm) ); //isUser middleware to check if the actual user is requesting this

router.route("/profile/:id")
    .get(wrapAsync(users.renderProfileIndex))
    .put(upload.single("image"), isLoggedIn, isUser, validateUser, wrapAsync(users.updateProfile))
    .delete(isLoggedIn,isUser,wrapAsync(users.destroyUser));

router.get("/profile/:id/delete", isLoggedIn, isUser, wrapAsync(users.renderDeleteForm));









//router.get("/register", users.renderRegisterForm);
//router.post("/register", clearOriginalUrl, wrapAsync(users.createUser));
//router.get("/login", users.renderLoginForm);
//router.post("/login", passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}), users.loginUser);

module.exports = router;