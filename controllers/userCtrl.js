import userModel from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import moment from "moment";

// REGISTER CONTROLLER
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (existingUser) {
      return res
        .status(409)
        .send({ message: "User already exists", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);

    // Create and save user
    // const newUser = new userModel({
    //   name,
    //   email: email.toLowerCase(),
    //   password: hashedPassword,
    // });

    await newUser.save();

    res.status(201).send({ message: "Registered successfully", success: true });
  } catch (e) {
    console.error("Register Error:", e);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${e.message}`,
    });
  }
};

// LOGIN CONTROLLER
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid Email or Password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Placeholder: Ideally return a JWT token here
    res.status(200).send({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({
      success: false,
      message: `Login Controller Error: ${error.message}`,
    });
  }
};

// AUTH CONTROLLER
export const authController = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.error("AuthController Error:", error);
    res.status(500).send({
      message: "Error getting user data",
      success: false,
      error,
    });
  }
};

//Apply doctor From Controller
export const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({
      ...req.body,
      status: "pending",
    });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName || ""} ${
        newDoctor.lastName || ""
      } Has Applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: `Doctor Account Applied Successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error in Applying the Doctor`,
    });
  }
};

//notification controller
export const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.body.userId,
    });
    const seennotification = user.seennotification;
    const notification = user.notification;
    user.seennotification = user.seennotification.concat(user.notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification Controller",
      success: false,
      error,
    });
  }
};

//delete notifications
export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notification Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to Delete All Notifications",
      error,
    });
  }
};

//get All Doctor
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctor Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error while fetching doctor",
    });
  }
};

//book Appointment
export const bookAppointmentController = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { date } = req.body;
    const formattedDate = moment(date, "DD-MM-YYYY").startOf("day").toDate();
    req.body.time = moment(req.body.time, "HH:mm").format("HH:mm");
    req.body.status = "pending";
    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    // if (!user) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "Doctor not found",
    //   });
    // }
    user.notification = user.notification || [];
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Booking Appointment",
      error,
    });
  }
};

//booking Availability check
export const bookingAvailabilityController = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const formattedDate = moment(date, "DD-MM-YYYY").startOf("day").toDate();
    const formattedTime = moment(time, "HH:mm").format("HH:mm");

    const appointment = await AppointmentModel.findOne({
      doctorId,
      date: formattedDate,
      time: formattedTime,
    });

    if (appointment) {
      return res.status(200).send({
        message: "Appointment already exists at this time",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Time slot is available for booking",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error checking booking availability",
    });
  }
};

//user Appointment contrller
export const userAppointmentsController = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "UserId is required",
      });
    }
    const appointments = await AppointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "User Appointment Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointment",
    });
  }
};
