const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadUserProfilePic
} = require("../controllers/user.controller");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authGuard, getProfile);

router.put("/updateProfile", authGuard, updateProfile);

router.put("/uploadProfileImg", authGuard, upload.single('image'), uploadUserProfilePic);

// router.get("/", getUsers);

// router.get("/user",getUser );

// router.post("/", addUser);

// router.put("/:id", updateUser);

// router.put("/softdelete/:id", softDeleteUser);

// router.put("/unsoftdelete/:id", unsoftDeleteUser);

// router.delete("/:id", deleteUser);

// router.post("/follow", followUser);

// router.post("/unfollow", unfollowUser);

// router.get("/followers/:userId", getFollowersInfo);

// router.get("/following/:userId", getFollowingInfo);

module.exports = router;
