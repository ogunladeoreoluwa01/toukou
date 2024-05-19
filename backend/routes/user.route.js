const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
  
} = require("../controllers/user.controller");


router.post("/register",registerUser)

router.get("/login" ,loginUser)

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
