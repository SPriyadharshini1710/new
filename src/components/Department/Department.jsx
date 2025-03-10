import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

const API_URL = "http://127.0.0.1:8000/api/departments/";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    department_code: "", 
    phone_number: "", 
    email: "", 
    location: "", 
    num_employees: "",  // ✅ Added `num_employees`
    remarks: "", 
    is_active: true 
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(API_URL);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowModal = (department = null) => {
    if (department) {
      setFormData({ 
        name: department.name, 
        description: department.description, 
        department_code: department.department_code, 
        phone_number: department.phone_number, 
        email: department.email, 
        location: department.location, 
        num_employees: department.num_employees || 0,  // ✅ Ensure it's always a number
        remarks: department.remarks, 
        is_active: department.is_active 
      });
      setEditingId(department.id);
    } else {
      setFormData({ 
        name: "", 
        description: "", 
        department_code: "", 
        phone_number: "", 
        email: "", 
        location: "", 
        num_employees: "",  // ✅ Reset `num_employees`
        remarks: "", 
        is_active: true 
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowViewModal = (department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedDepartment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedData = {
        ...formData,
        num_employees: formData.num_employees ? parseInt(formData.num_employees) : 0, // ✅ Ensure it's a number
      };

      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, sanitizedData);
        setMessage({ text: "Department updated successfully", type: "success" });
      } else {
        await axios.post(API_URL, sanitizedData);
        setMessage({ text: "Department added successfully", type: "success" });
      }
      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      setMessage({ text: "Error saving department", type: "danger" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        setMessage({ text: "Department deleted successfully", type: "warning" });
        fetchDepartments();
      } catch (error) {
        setMessage({ text: "Error deleting department", type: "danger" });
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Department Management</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          ➕ Add Department
        </Button>
      </div>

      {message.text && <Alert variant={message.type} className="mt-3">{message.text}</Alert>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Location</th>
            <th>Employees</th> {/* ✅ Added column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.name}</td>
              <td>{dept.department_code}</td>
              <td>{dept.phone_number}</td>
              <td>{dept.email}</td>
              <td>{dept.location}</td>
              <td>{dept.num_employees}</td> {/* ✅ Display `num_employees` */}
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowViewModal(dept)}>View</Button>{" "}
                <Button variant="warning" size="sm" onClick={() => handleShowModal(dept)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(dept.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Department" : "Add Department"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department Code</Form.Label>
              <Form.Control type="text" name="department_code" value={formData.department_code} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Employees</Form.Label>
              <Form.Control type="number" name="num_employees" value={formData.num_employees} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingId ? "Update" : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Department Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDepartment && (
            <div>
              <p><strong>Name:</strong> {selectedDepartment.name}</p>
              <p><strong>Description:</strong> {selectedDepartment.description}</p>
              <p><strong>Department Code:</strong> {selectedDepartment.department_code}</p>
              <p><strong>Phone Number:</strong> {selectedDepartment.phone_number}</p>
              <p><strong>Email:</strong> {selectedDepartment.email}</p>
              <p><strong>Location:</strong> {selectedDepartment.location}</p>
              <p><strong>Number of Employees:</strong> {selectedDepartment.num_employees}</p>
              <p><strong>Remarks:</strong> {selectedDepartment.remarks}</p>
              <p><strong>Status:</strong> {selectedDepartment.is_active ? "Active" : "Inactive"}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Department;
