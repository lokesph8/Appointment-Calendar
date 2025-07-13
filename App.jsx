import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Calendar from './components/Calendar';
import AppointmentForm from './components/AppointmentForm';
import Header from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const handleCreateAppointment = (date) => {
    setSelectedDate(date);
    setEditingAppointment(null);
    setCurrentView('form');
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setCurrentView('form');
  };

  const handleFormClose = () => {
    setCurrentView('calendar');
    setSelectedDate(null);
    setEditingAppointment(null);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {currentView === 'calendar' && (
          <Calendar
            onCreateAppointment={handleCreateAppointment}
            onEditAppointment={handleEditAppointment}
          />
        )}
        {currentView === 'form' && (
          <AppointmentForm
            selectedDate={selectedDate}
            editingAppointment={editingAppointment}
            onClose={handleFormClose}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppointmentProvider>
          <AppContent />
        </AppointmentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;