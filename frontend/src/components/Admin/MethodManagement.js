import React, { useEffect, useState } from "react";
import {
  fetchMethods,
  saveMethod,
  deleteMethod,
} from "../../services/api";
import { Table, Button, Form, Modal } from "react-bootstrap";

function MethodManagement() {
  const [methods, setMethods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: "",
    description: "",
    sequence: methods.length + 1,
    mandatory: false,
  });

  useEffect(() => {
    fetchMethods().then(setMethods);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMethod({ ...newMethod, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setNewMethod({ ...newMethod, mandatory: e.target.checked });
  };

  const handleSave = async () => {
    const savedMethod = await saveMethod(newMethod);
    setMethods([...methods, savedMethod]);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    await deleteMethod(id);
    setMethods(methods.filter((method) => method._id !== id));
  };

  return (
    <div className="mt-4">
      <h3>Communication Method Management</h3>
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        Add Method
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Sequence</th>
            <th>Mandatory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((method) => (
            <tr key={method._id}>
              <td>{method.name}</td>
              <td>{method.description}</td>
              <td>{method.sequence}</td>
              <td>{method.mandatory ? "Yes" : "No"}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(method._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={newMethod.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={newMethod.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sequence</Form.Label>
              <Form.Control
                name="sequence"
                type="number"
                value={newMethod.sequence}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                label="Mandatory"
                name="mandatory"
                checked={newMethod.mandatory}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MethodManagement;
