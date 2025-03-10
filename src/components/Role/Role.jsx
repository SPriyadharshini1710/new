import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";

const API_URL = "http://127.0.0.1:8000/api/roles/";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    description: "",
    status: 1,
  });
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchDepartments();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(API_URL);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/departments/");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowModal = (role = null) => {
    if (role) {
      setFormData({
        name: role.name,
        department: role.department ? role.department.id : "",
        description: role.description,
        status: role.status,
      });
      setEditingId(role.id);
    } else {
      setFormData({
        name: "",
        department: "",
        description: "",
        status: 1,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowViewModal = (role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedRole(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, formData);
        setMessage({ text: "Role updated successfully", type: "success" });
      } else {
        await axios.post(API_URL, formData);
        setMessage({ text: "Role added successfully", type: "success" });
      }
      fetchRoles();
      handleCloseModal();
    } catch (error) {
      setMessage({ text: "Error saving role", type: "danger" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        setMessage({ text: "Role deleted successfully", type: "warning" });
        fetchRoles();
      } catch (error) {
        setMessage({ text: "Error deleting role", type: "danger" });
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Role Management</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          ➕ Add Role
        </Button>
      </div>

      {message.text && <Alert variant={message.type} className="mt-3">{message.text}</Alert>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{role.department ? role.department.name : "N/A"}</td>
              <td>{role.status === 1 ? "Active" : "Inactive"}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowViewModal(role)}>View</Button>{" "}
                <Button variant="warning" size="sm" onClick={() => handleShowModal(role)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(role.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Role" : "Add Role"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
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
          <Modal.Title>Role Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRole && (
            <div>
              <p><strong>Name:</strong> {selectedRole.name}</p>
              <p><strong>Department:</strong> {selectedRole.department ? selectedRole.department.name : "N/A"}</p>
              <p><strong>Description:</strong> {selectedRole.description}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Role;
