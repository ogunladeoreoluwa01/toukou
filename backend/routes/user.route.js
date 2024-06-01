const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminAuthMiddleware");
const superAdminGuard = require("../middlewares/superAdminAuthMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");
const checkSoftDelete = require("../middlewares/softDeleteStatus");
const checkSoftDeleteLogin = require("../middlewares/checkDeleteStatsLogin");
const checkBanStatusLogin = require("../middlewares/checkBanStatLogin");
const upload = require("../middlewares/upload");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getProfile,
  getUserProfile,
  getUserProfileByName,
  updateProfile,
  uploadUserProfilePic,
  uploadUserBannerPic,
  changePassword,
  unSoftDelete,
  SoftDelete,
  banUser,
  getBannedUsers,
  unbanUser,
  permadelete,
  makeAdmin,
  demoteAdmin,
  permanentlyDeleteUserBySupAdmin,
} = require("../controllers/user.controller");

// Public routes
router.post("/register", registerUser);
router.post("/login", checkBanStatusLogin, checkSoftDeleteLogin, loginUser);
router.get("/all", getAllUsers);

// Protected routes (requires authentication)
router.get("/profile", authGuard, checkSoftDelete, checkBanStatus, getProfile);
router.get(
  "/getuser/:userId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  getUserProfile
);
router.get("/getuserbyname", adminGuard, getUserProfileByName);
router.put(
  "/updateProfile",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  updateProfile
);
router.post(
  "/uploadProfileImg",
  upload.single("image"),
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  uploadUserProfilePic
);
router.post(
  "/uploadBannerImage",
  upload.single("image"),
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  uploadUserBannerPic
);

router.put(
  "/changePassword",
  authGuard,
  checkBanStatus,
  checkSoftDelete,
  changePassword
);
router.delete("/permaDelete", authGuard, permadelete);
router.put(
  "/softDelete",
  authGuard,
  checkBanStatus,
  checkSoftDelete,
  SoftDelete
);
router.put("/unSoftDelete", authGuard, checkBanStatus, unSoftDelete);
// Admin routes (requires additional authorization, ensure you have an admin guard)

router.post("/ban", adminGuard, checkBanStatus, checkSoftDelete, banUser);

router.get(
  "/getbannedUser",
  adminGuard,
  checkBanStatus,
  checkSoftDelete,
  getBannedUsers
);

router.post("/unban", adminGuard, checkBanStatus, checkSoftDelete, unbanUser);
// superAdmin routes (requires additional authorization, ensure you have an admin guard)
router.put(
  "/makeadmin",
  superAdminGuard,
  checkBanStatus,
  checkSoftDelete,
  makeAdmin
);
router.put(
  "/demoteadmin",
  superAdminGuard,
  checkBanStatus,
  checkSoftDelete,
  demoteAdmin
);
router.delete(
  "/deleteSupAdmin",
  superAdminGuard,
  permanentlyDeleteUserBySupAdmin
);

module.exports = router;
