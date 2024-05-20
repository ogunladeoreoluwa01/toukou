const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminAuthMiddleware");
const superAdminGuard = require("../middlewares/superAdminAuthMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadUserProfilePic,
  changePassword,
  unSoftDelete,
  SoftDelete,
  banUser,
  unbanUser,
  permadelete,
  makeAdmin,
  demoteAdmin,
  permanentlyDeleteUserBySupAdmin,
} = require("../controllers/user.controller");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (requires authentication)
router.get("/profile", authGuard, checkBanStatus, getProfile);
router.put("/updateProfile", authGuard, checkBanStatus, updateProfile);
router.put(
  "/uploadProfileImg",
  authGuard,
  checkBanStatus,
  uploadUserProfilePic
);
router.put("/changePassword", authGuard, checkBanStatus, changePassword);
router.delete("/permaDelete", authGuard, permadelete);
router.put("/SoftDelete", authGuard, checkBanStatus, SoftDelete);
router.put("/unSoftDelete", authGuard, checkBanStatus, unSoftDelete);
// Admin routes (requires additional authorization, ensure you have an admin guard)

router.post("/ban", adminGuard, checkBanStatus, banUser);
router.post("/unban", adminGuard, checkBanStatus, unbanUser);
// superAdmin routes (requires additional authorization, ensure you have an admin guard)
router.put("/makeAdmin", superAdminGuard, checkBanStatus, makeAdmin);
router.put("/demoteAdmin", superAdminGuard, checkBanStatus, demoteAdmin);
router.delete(
  "/deleteSupAdmin",
  superAdminGuard,
  checkBanStatus,
  permanentlyDeleteUserBySupAdmin
);

module.exports = router;
