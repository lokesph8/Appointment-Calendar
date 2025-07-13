import React, { useState, useEffect } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import AppointmentCard from './AppointmentCard';

const Calendar = ({ onCreateAppointment, onEditAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const { appointments } = useAppointments();

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setViewMode(isMobile ? 'list' : 'month');
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatListDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && aptDate <= twoWeeksFromNow;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleDateClick = (date) => {
    onCreateAppointment(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  if (viewMode === 'list') {
    const upcomingAppointments = getUpcomingAppointments();
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-title">
            <h2>Upcoming Appointments</h2>
            <button 
              onClick={() => onCreateAppointment(new Date())}
              className="new-appointment-button"
            >
              + New Appointment
            </button>
          </div>
        </div>

        <div className="appointments-list">
          {upcomingAppointments.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming appointments</p>
              <button 
                onClick={() => onCreateAppointment(new Date())}
                className="empty-state-button"
              >
                Schedule First Appointment
              </button>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-list-item">
                <div className="appointment-date">
                  {formatListDate(new Date(appointment.date))}
                </div>
                <AppointmentCard
                  appointment={appointment}
                  onEdit={() => onEditAppointment(appointment)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button 
            onClick={() => navigateMonth(-1)}
            className="nav-button"
            aria-label="Previous month"
          >
            ← Previous
          </button>
          <h2 className="calendar-month">{formatDate(currentDate)}</h2>
          <button 
            onClick={() => navigateMonth(1)}
            className="nav-button"
            aria-label="Next month"
          >
            Next →
          </button>
        </div>
        
        <button 
          onClick={() => onCreateAppointment(new Date())}
          className="new-appointment-button"
        >
          + New Appointment
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);

            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonthDay ? 'other-month' : ''} ${isTodayDay ? 'today' : ''}`}
                onClick={() => handleDateClick(day)}
                tabIndex={0}
                role="button"
                aria-label={`${day.toDateString()}, ${dayAppointments.length} appointments`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDateClick(day);
                  }
                }}
              >
                <div className="day-number">{day.getDate()}</div>
                <div className="day-appointments">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`appointment-item ${appointment.type}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAppointment(appointment);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${appointment.patientName} at ${appointment.time}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditAppointment(appointment);
                        }
                      }}
                    >
                      <div className="appointment-time">{appointment.time}</div>
                      <div className="appointment-patient">{appointment.patientName}</div>
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="appointment-overflow">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;