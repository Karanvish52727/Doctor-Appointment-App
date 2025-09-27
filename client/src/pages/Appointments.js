import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
// import { title } from "process";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const getAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/user/user-appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorId.firstName} {record.doctorId.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorId.phone}</span>,
    // },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {record.date} {record.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  useEffect(() => {
    getAppointments();
  }, []);
  return (
    <Layout>
      <h1 className="text-center">Appointments Lists</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
