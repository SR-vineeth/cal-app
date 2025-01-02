import React, { useState } from "react";
import { logCommunication } from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";

function LogCommunicationModal({ isOpen, onClose, companyIds, onCommunicationLogged }) {
  const [communication, setCommunication] = useState({
    type: "Email",
    date: new Date().toISOString().substring(0, 10),
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommunication({ ...communication, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      for (let companyId of companyIds) {
        await logCommunication({ ...communication, company: companyId });
      }
      alert("Communication logged!");
      onClose();
      onCommunicationLogged(); // Notify parent to re-fetch communications
    } catch (error) {
      console.error("Error logging communication:", error);
      alert("Failed to log communication. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Log Communication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Type of Communication</Form.Label>
            <Form.Select
              name="type"
              value={communication.type}
              onChange={handleInputChange}
            >
              <option value="LinkedIn Post">LinkedIn Post</option>
              <option value="LinkedIn Message">LinkedIn Message</option>
              <option value="Email">Email</option>
              <option value="Phone Call">Phone Call</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={communication.date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={communication.notes}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogCommunicationModal;
