import React from 'react'
import './ConfirmationModal.css';
import { IoIosClose } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { useAppointment } from '../../../context/AppointmentContext/AppointmentContext';

const ConfirmationModal = ({ confirmAppointment, handleAppointmentModalClose }) => {

    const { appointmentPayload } = useAppointment()
    const venueName = appointmentPayload?.selectedStore?.name || '';
    const venueLocation = appointmentPayload?.selectedStore?.city || '';
    const venueTime = appointmentPayload?.selectedSlot.split(" - ")[0].trim() || '';
    const dateObj = new Date(appointmentPayload?.selectedDate);

    const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className={`appointment-confirmation-modal ${confirmAppointment ? 'show-confirmation-modal' : ''}`}>
            <div className={`appointment-confirmation-modal-inner-container`}>

                <button className='appointment-modal-close-button' onClick={handleAppointmentModalClose}>
                    <IoIosClose size={20} color='var(--secondary-color)' />
                </button>

                <div className='appointment-confirmation-modal-head'>
                    <SlCalender size={20} color='var(--tertiary-color)' />
                    <h3>Schedule a Consultation</h3>
                </div>

                <div className='appointment-confirmation-modal-body'>
                    <h3>You are all set</h3>
                    <p>Thank you for scheduling your consultation. You will receive an email with your appointment details.</p>

                    <div className='appointment-confirmation-time-and-date'>
                        <span>
                            <h3>{venueName}</h3>
                            <p>{venueLocation}</p>
                        </span>
                        <h3>{venueTime} on {formattedDate}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
