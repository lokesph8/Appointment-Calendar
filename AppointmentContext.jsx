import React, { createContext, useContext, useState, useEffect } from 'react';

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('clinic_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      // Initialize with sample data
      const sampleAppointments = [
        {
          id: '1',
          patientName: 'John Doe',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          type: 'consultation',
          notes: 'Initial consultation for back pain'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time: '14:30',
          type: 'follow-up',
          notes: 'Follow-up appointment for medication review'
        }
      ];
      setAppointments(sampleAppointments);
      localStorage.setItem('clinic_appointments', JSON.stringify(sampleAppointments));
    }
  }, []);

  const saveAppointments = (newAppointments) => {
    setAppointments(newAppointments);
    localStorage.setItem('clinic_appointments', JSON.stringify(newAppointments));
  };

  const addAppointment = (appointment) => {
    const newAppointments = [...appointments, appointment];
    saveAppointments(newAppointments);
  };

  const updateAppointment = (id, updatedAppointment) => {
    const newAppointments = appointments.map(apt => 
      apt.id === id ? { ...apt, ...updatedAppointment } : apt
    );
    saveAppointments(newAppointments);
  };

  const deleteAppointment = (id) => {
    const newAppointments = appointments.filter(apt => apt.id !== id);
    saveAppointments(newAppointments);
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};