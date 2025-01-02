import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  fetchCommunications,
  deleteCommunication,
  deleteCompany,
} from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";

const localizer = momentLocalizer(moment);

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString().substring(0, 10),
  });

  useEffect(() => {
    fetchCommunications().then((data) => {
      const mappedEvents = data.map((comm) => ({
        id: comm._id, // Ensure each event has a unique ID
        title: `${comm.type} - ${comm.company?.name || "Unknown"}`,
        start: new Date(comm.date),
        end: new Date(comm.date),
        notes: comm.notes,
        companyId: comm.company?._id, // Save company ID for related events
      }));
      setEvents(mappedEvents);
    });
  }, []);

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle new event submission
  const handleAddEventSubmit = () => {
    const newCalendarEvent = {
      id: new Date().getTime().toString(), // Generate a unique ID
      title: newEvent.title,
      start: new Date(newEvent.date),
      end: new Date(newEvent.date),
      notes: "User added event",
    };
    setEvents([...events, newCalendarEvent]);
    setShowAddEventModal(false);
  };

  // Handle event deletion (local and server)
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await deleteCommunication(selectedEvent.id); // Delete from server
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      setShowEventModal(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Communication Calendar</h2>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setShowAddEventModal(true)}>
          Add Event
        </Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick} // Event click handler
        defaultView={Views.MONTH} // Default view
        views={[Views.MONTH, Views.WEEK, Views.DAY]} // Enable Month, Week, Day views
        toolbar={true} // Show navigation toolbar
        onNavigate={(date, view) => console.log(`Navigated to ${view}: ${date}`)} // Log navigation
        onView={(view) => console.log(`Current view: ${view}`)} // Log current view
      />

      {/* Event Details Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Title:</strong> {selectedEvent?.title}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {selectedEvent?.start?.toLocaleDateString()}
          </p>
          <p>
            <strong>Notes:</strong>{" "}
            {selectedEvent?.notes || "No additional notes"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete Event
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowEventModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add New Event Modal */}
      <Modal show={showAddEventModal} onHide={() => setShowAddEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddEventModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEventSubmit}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CalendarView;
