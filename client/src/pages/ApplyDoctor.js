// import { Layout } from 'antd'
import Layout from "./../components/Layout";
import React from "react";
import { Col, Form, Input, message, Row, TimePicker } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-doctor",
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
  return (
    <Layout>
      <h1 className="text-center">Apply Doctor</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <h4 className="text-center"> Personal Details : </h4>
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
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
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

        <h4 className="text-center"> Professional Details : </h4>
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
              Submit
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
