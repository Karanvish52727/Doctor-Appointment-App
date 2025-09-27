import express from "express";
import {
  getAllUsersController,
  getAllDoctorsControler,
  changeAccountStatusController,
} from "../controllers/adminCtrl.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = express.Router();

//get Method || USers
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//get Method || Doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsControler);

//Post Account Status
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

export default router;
