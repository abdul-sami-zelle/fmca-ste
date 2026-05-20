'use client'

import React, { useEffect, useState } from 'react'
import './BookAppointment.css'
import '../../../Global-Components/AppointmentModal/AppointmentModal.css'
import TypeTab from '@/Global-Components/AppointmentModal/AppointmentTabs/TypeTab/TypeTab'
import LocationTab from '@/Global-Components/AppointmentModal/AppointmentTabs/LocationTab/LocationTab'
import DateTimeTab from '@/Global-Components/AppointmentModal/AppointmentTabs/DateTimeTab/DateTimeTab'
import ReviewTab from '@/Global-Components/AppointmentModal/AppointmentTabs/ReviewTab/ReviewTab'
import { useAppointment } from '@/context/AppointmentContext/AppointmentContext'
import ConfirmationModal from '@/Global-Components/AppointmentModal/ConfirmationModal/ConfirmationModal'
import Loader from '../Loader/Loader'
import axios from 'axios'
import { url } from '@/utils/api'

const BookAppointmentClient = ({ params }) => {



    const [selectedTab, setSelectedTab] = useState(1);
    const [loading, setLoading] = useState(false);
    const [serviceIndex, setServiceTypeIndex] = useState(0)
    const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState()

    const tabs = [
        { id: 1, title: 'Type' },
        { id: 2, title: 'Location' },
        { id: 3, title: 'Date/Time' },
        { id: 4, title: 'Review' },
    ]

    const handleSelectedTab = (tab) => {
        if (tab < selectedTab) {
            setSelectedTab(tab);
        }
    }
    const { appointmentPayload, setAppointmentPayload, setError } = useAppointment()


    const handleServiceType = (service, index) => {
        setAppointmentPayload((prevData) => ({
            ...prevData,
            serviceType: service
        }))
        setServiceTypeIndex(index)
    }

    const handleCategorySelect = (category) => {
        setAppointmentPayload((prev) => {
            // Check if the category already exists in selectedCategories
            const isCategoryExists = prev.selectedCategories.some(
                (item) => item._id === category._id
            );

            // If category already exists, remove it (toggle behavior)
            const updatedCategories = isCategoryExists
                ? prev.selectedCategories.filter((item) => item._id !== category._id)
                : [...prev.selectedCategories, { name: category.name, uid: category.uid, _id: category._id }];

            return {
                ...prev,
                selectedCategories: updatedCategories
            };
        });
    }

    const handleSelectStore = (store) => {
        setAppointmentPayload((prev) => ({
            ...prev,
            selectedStore: {
                store_id: store?.store_id,
                _id: store?._id,
                name: store?.name,
                phone: store?.phone,
                city: store?.city
            }
        }))



        if (Object.keys(store).length > 0) {
            setSelectedTab(selectedTab + 1)
        }

        if (typeof window !== 'undefined') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }


    const [confirmAppointment, setConfirmAppointment] = useState(false)

    const handleSubmitAppointment = async () => {
        let newErrors = {};


        const api = `/api/v1/appointments/book-appointment`;
        try {
            setLoading(true)

            Object.keys(appointmentPayload.details).forEach((field) => {
                if (field === 'associate') return;

                if (!appointmentPayload.details?.[field]?.trim()) {
                    newErrors[field] = `Required`;
                }
            });

            if (Object.keys(newErrors).length > 0) {
                setError((prev) => ({ ...prev, ...newErrors }));
                console.error("Errors found: ", newErrors);
                return false
            }

            const response = await axios.post(url + api, appointmentPayload);
            if (response.status !== 201) {
                handleOpenSnakeBar()
            }
            if (response.status === 201) {
                handleAppointmentModal()
            }
        } catch (error) {
            console.error("UnExpected Server Error", error);
            handleOpenSnakeBar()
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenSnakeBar = (message) => {
        setShowSnakeBar(true)
        setSnakeBarMessage(message)
    }

    const handleAppointmentModal = (type) => {
        setConfirmAppointment(true);
    }

    const handleAppointmentModalClose = () => {
        setConfirmAppointment(false);
        setSelectedTab(1)
        setServiceTypeIndex(null)
        setAppointmentPayload({
            serviceType: '',
            selectedCategories: [],
            selectedStore: {},
            otherDetails: 'Customer has sensitive skin',
            selectedDate: '',
            selectedSlot: '',
            details: {
                firstName: '',
                lastName: '',
                email: '',
                contact: '',
                associate: ''
            }
        })
    }


    return (
        <div className='book-an-appointment-main-container'>
            <div className='book-appointment-head'>
                <h3 className='book-appointment-main-container'>Book an Appointment</h3>
                <p className='book-appointment-slogan'>Do You Want Our Expert To Give You The Advice, Book An Appointment Now</p>
            </div>


            <div className={`appointment-page-inner-container ${confirmAppointment ? 'hide-appointment-modal' : ''}`}>
                {loading && <Loader />}

                <div className='appointment-inner-content'>

                    <div className='appointment-modal-tabs-container'>

                        <div className='pagination-tab-section-container'>
                            <div className={`pagination-tab-line`}></div>
                            <div className='appointment-modal-tab-pagination'>
                                {tabs.map((item, index) => (
                                    <div key={index} className='appointment-modal-tab-btn-container'>
                                        <button key={index} onClick={() => handleSelectedTab(index + 1)} className={`appointment-modal-tab-btn ${(selectedTab >= index + 1) ? 'selected-tab' : ''}`}>{item.id}</button>
                                        <p>{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='appointment-modal-tab-content'>
                            {
                                selectedTab === 1 ? <TypeTab
                                    handleServiceType={handleServiceType}
                                    selectedTab={selectedTab}
                                    setSelectedTab={setSelectedTab}
                                    handleCategorySelect={handleCategorySelect}
                                    serviceIndex={serviceIndex}
                                />
                                    : selectedTab === 2 ? <LocationTab
                                        selectedTab={selectedTab}
                                        setSelectedTab={setSelectedTab}
                                        handleSelectStore={handleSelectStore}
                                    />
                                        : selectedTab === 3 ? <DateTimeTab
                                            selectedTab={selectedTab}
                                            setSelectedTab={setSelectedTab}
                                        />
                                            : <ReviewTab
                                                handleSubmitAppointment={handleSubmitAppointment}
                                                selectedTab={selectedTab}
                                                setSelectedTab={setSelectedTab}
                                            />
                            }
                        </div>
                    </div>


                </div>

            </div>

            <ConfirmationModal
                confirmAppointment={confirmAppointment}
                handleAppointmentModalClose={handleAppointmentModalClose}
            />

        </div>
    )
}

export default BookAppointmentClient
