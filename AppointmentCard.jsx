import React from 'react';
import { useAppointments } from '../context/AppointmentContext';

const AppointmentCard = ({ appointment, onEdit }) => {
  const { deleteAppointment } = useAppointments();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(appointment.id);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'consultation': '#3B82F6',
      'follow-up': '#10B981',
      'emergency': '#EF4444',
      'routine': '#8B5CF6'
    };
    return colors[type] || '#6B7280';
  };

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <div className="appointment-info">
          <h3 className="patient-name">{appointment.patientName}</h3>
          <div className="appointment-details">
            <span className="appointment-time">🕐 {appointment.time}</span>
            <span 
              className="appointment-type-badge"
              style={{ backgroundColor: getTypeColor(appointment.type) }}
            >
              {appointment.type}
            </span>
          </div>
        </div>
        <div className="appointment-actions">
          <button 
            onClick={onEdit}
            className="edit-button"
            title="Edit appointment"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            className="delete-button"
            title="Delete appointment"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {appointment.notes && (
        <div className="appointment-notes">
          <p>{appointment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;