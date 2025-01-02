import React, { useEffect, useState } from "react";
import { fetchCompanies, saveCompany, deleteCompany } from "../../services/api";
import { Table, Button, Form, Modal } from "react-bootstrap";

function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    linkedIn: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    periodicity: "2 weeks",
  });

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleSave = async () => {
    if (newCompany.name) {
      if (currentCompanyId) {
        // Editing an existing company
        const updatedCompany = await saveCompany({ ...newCompany, _id: currentCompanyId });
        setCompanies(
          companies.map((company) =>
            company._id === currentCompanyId ? updatedCompany : company
          )
        );
      } else {
        // Adding a new company
        const savedCompany = await saveCompany(newCompany);
        setCompanies([...companies, savedCompany]);
      }

      setShowModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    await deleteCompany(id);
    setCompanies(companies.filter((company) => company._id !== id));
  };

  const handleEdit = (company) => {
    setCurrentCompanyId(company._id);
    setNewCompany({
      name: company.name,
      location: company.location,
      linkedIn: company.linkedIn,
      emails: company.emails,
      phoneNumbers: company.phoneNumbers,
      comments: company.comments,
      periodicity: company.periodicity,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentCompanyId(null);
    setNewCompany({
      name: "",
      location: "",
      linkedIn: "",
      emails: "",
      phoneNumbers: "",
      comments: "",
      periodicity: "2 weeks",
    });
  };

  return (
    <div className="mt-4">
      <h3>Company Management</h3>
      <Button className="mb-3" onClick={() => { resetForm(); setShowModal(true); }}>
        Add Company
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>LinkedIn</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.location}</td>
              <td>
                <a href={company.linkedIn} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(company)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(company._id)}
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
          <Modal.Title>{currentCompanyId ? "Edit Company" : "Add Company"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={newCompany.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={newCompany.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>LinkedIn Profile</Form.Label>
              <Form.Control
                name="linkedIn"
                value={newCompany.linkedIn}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Communication Periodicity</Form.Label>
              <Form.Control
                name="periodicity"
                value={newCompany.periodicity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Emails</Form.Label>
              <Form.Control
                name="emails"
                value={newCompany.emails}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Numbers</Form.Label>
              <Form.Control
                name="phoneNumbers"
                value={newCompany.phoneNumbers}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                name="comments"
                as="textarea"
                value={newCompany.comments}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {currentCompanyId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CompanyManagement;
