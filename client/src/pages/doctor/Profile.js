import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, message, Row, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice.js";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Params = useParams();
  const [form] = Form.useForm();

  //update Doctors LIst
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Doctor Applied Succesfully");
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(values);
      message.error("Something Went Wrong");
    }
  };

  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/doctor/getDoctorInfo",
        { userId: Params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, []);

  // Set form fields after doctor data is loaded
  useEffect(() => {
    if (doctor && doctor.timings && doctor.timings.length === 2) {
      const [start, end] = doctor.timings;
      form.setFieldsValue({
        ...doctor,
        timings: [moment(start, "HH:mm"), moment(end, "HH:mm")],
      });
    }
  }, [doctor, form]);

  return (
    <Layout>
      <h1>Manage Profile</h1>
      {doctor && (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          className="m-3"
        >
          <h4 className=""> Personal Details : </h4>
          <Row gutter={16}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No:"
                name="phone"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="Enter your Phone Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter your Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Website"
                name="website"
                rules={[{ required: false }]}
              >
                <Input type="text" placeholder="Enter your Website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter Clinic Address" />
              </Form.Item>
            </Col>
          </Row>

          <h4> Professional Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter your Specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Enter Your Experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Charged"
                name="feesPerCunsaltations"
                rules={[{ required: true }]}
              >
                <Input type="Number" placeholder="Enter the fees" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="timings"
                name="timings"
                rules={[{ required: true }]}
              >
                <TimePicker.RangePicker format={"HH:mm"} />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
