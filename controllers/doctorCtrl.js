import AppointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModels from "../models/userModels.js";
// import userModels from "../models/userModels";

// GET doctor info controller
export const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in Fetching Doctor Details:", error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching Doctor Details",
      error: error.message,
    });
  }
};

//update Doctor Profile
export const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log("Update Error", error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error: error.message,
    });
  }
};

export const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doc Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in single doctor info",
    });
  }
};

export const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointment = await AppointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointment Fetched Successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: `Error in Doctor Appointment`,
    });
  }
};

export const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status }
    );

    const user = await userModels.findOne({ _id: appointment.userId });
    const notification = user.notification;
    notification.push({
      type: "appointment-status-updated",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: `Error in Update Status`,
    });
  }
};
