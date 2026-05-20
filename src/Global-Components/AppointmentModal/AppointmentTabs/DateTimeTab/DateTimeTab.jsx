'use client'

import React, { useEffect, useState } from 'react'
import './DateTimeTab.css'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/cjs/Calendar.js'
import { useAppointment } from '../../../../context/AppointmentContext/AppointmentContext'
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const DateTimeTab = ({ selectedTab, setSelectedTab }) => {
  const { appointmentPayload, setAppointmentPayload } = useAppointment();
  const [dateState, setDateState] = useState(new Date());
  const today = new Date();
  const timeSlots = [
    { time: '10:00 AM - 11: 00 PM' },
    { time: '11:00 AM - 12: 00 PM' },
    { time: '12:00 AM - 01: 00 PM' },
    { time: '01:00 AM - 02: 00 PM' },
    { time: '02:00 AM - 03: 00 PM' },
    { time: '03:00 AM - 04: 00 PM' },
    { time: '04:00 AM - 05: 00 PM' },
  ]

  // Set today's time to midnight for accurate comparisons.
  today.setHours(0, 0, 0, 0);
  // Calculate the date 30 days from today.
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  const [showTimeSlots, setShowTimeSlots] = useState(false);

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    setDateState(todayDate); // Ensure dateState is set
    setAppointmentPayload((prev) => ({
      ...prev,
      selectedDate: todayDate,
    }));
  }, []);


  // const [currentDate, setCurrentDate] = useState();
  const changeDate = (date) => {
    setDateState(date); // this updates the calendar selection
    const selectedDate = new Date(date);
    selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
    setAppointmentPayload((prev) => ({
      ...prev,
      selectedDate: selectedDate.toISOString().split('T')[0]
    }));
    setShowTimeSlots(true);
    // if(today.toISOString().split('T')[0] === date.toISOString().split('T')[0]) {
    //   setCurrentDate(date.toISOString().split('T')[0]);
    // }
    
  };

  useEffect(() => {

  }, [dateState])

  const handleSelectTimeSlote = (item) => {
    setAppointmentPayload((prev) => ({
      ...prev,
      selectedSlot: item,
    }))
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }


  const isSameDay = (d1, d2) => {
    const date1 = d1 instanceof Date ? d1 : new Date(d1);
    const date2 = d2 instanceof Date ? d2 : new Date(d2);

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handlePrevTab = () => {
    setSelectedTab(selectedTab - 1);
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }


  return (
    <div className='date-time-outer-core-container'>
      <div className='date-time-tab-main-container'>
        <div className='date-time-tab-calender-section'>
          <Calendar
            value={dateState}
            onChange={changeDate}
            tileDisabled={({ date }) => date < today || date > maxDate}
            formatShortWeekday={(locale, date) =>
              date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)
            }
            tileClassName={({ date, view }) => {
              let classes = ['custom-tile']; // keep your existing class

              if (view === 'month') {
                if (isSameDay(date, dateState)) {
                  classes.push('selected-date');
                } else if (isSameDay(date, today)) {
                  classes.push('today-date');
                }
              }

              return classes.join(' ');
            }}
            prevLabel={<MdKeyboardArrowLeft color='var(--text-gray)' size={20} />}
            nextLabel={<MdKeyboardArrowRight color='var(--text-gray)' size={20} />}
          />
        </div>
        <div className='date-time-tab-times-slots'>
          {timeSlots.map((item, index) => (
            <p key={index} onClick={() => { handleSelectTimeSlote(item.time); setSelectedTab(selectedTab + 1) }} className='single-time-slot'>{item.time}</p>
          ))}
        </div>
      </div>

      <div className='location-tab-buttons-container'>
        <button onClick={handlePrevTab}>Previous</button>
      </div>
    </div>

  )
}

export default DateTimeTab
