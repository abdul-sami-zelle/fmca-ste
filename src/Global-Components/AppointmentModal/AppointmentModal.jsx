import React, { useEffect, useState } from 'react'
import './AppointmentModal.css';
import { IoIosClose } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import TypeTab from './AppointmentTabs/TypeTab/TypeTab';
import LocationTab from './AppointmentTabs/LocationTab/LocationTab';
import DateTimeTab from './AppointmentTabs/DateTimeTab/DateTimeTab';
import ReviewTab from './AppointmentTabs/ReviewTab/ReviewTab';
import { useAppointment } from '../../context/AppointmentContext/AppointmentContext';
import axios from 'axios';
import { url } from '../../utils/api';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import Loader from '../../UI/Components/Loader/Loader';
import SnakBar from '../SnakeBar/SnakBar';
import Image from 'next/image';

const AppointmentModal = (
    {
        showAppointMentModal,
        handleCloseModal,
        setAppointmentModal,
        handleOpenSnakeBar,
        setErrorMessage,
        selectedTab,
        setSelectedTab,
        serviceIndex,
        setServiceTypeIndex
    }) => {

    const tabs = [
        { id: 1, title: 'Type' },
        { id: 2, title: 'Location' },
        { id: 3, title: 'Date/Time' },
        { id: 4, title: 'Review' },
    ]

    // const [serviceIndex, setServiceTypeIndex] = useState(null)
    const [loading, setLoading] = useState(false);
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
    }


    const [confirmAppointment, setConfirmAppointment] = useState(false)

    const handleSubmitAppointment = async () => {
        let newErrors = {};


        const api = `/api/v1/appointments/book-appointment`;
        try {
            setLoading(true)

            Object.keys(appointmentPayload.details).forEach((field) => {
                if (field === 'associate') return;

                if(field === 'address') return

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
                addess: '',
                associate: ''
            }
        })
    }

    return (
        <div className={`appointment-modal-main-container ${showAppointMentModal ? 'show-appointment-modal' : ''}`} onClick={handleCloseModal}>

            <div className={`appointment-modal-inner-container ${confirmAppointment ? 'hide-appointment-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
                {loading && <Loader />}

                <div className='appointment-inner-content'>
                    <div className='appointment-modal-head-section'>

                        <div className='appointment-modal-head'>
                            <SlCalender size={25} color='var(--orange-fill)' />
                            <p>Schedule a Consultation</p>
                        </div>

                        <button className='appointment-modal-close-btn' onClick={handleCloseModal}>
                            {/* <IoIosClose size={30} color='var(--secondary-color)' /> */}
                            <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='close' />
                        </button>
                    </div>



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
                                            />
                            }
                        </div>
                    </div>

                    {/*Tab Pagination */}

                </div>

            </div>

            <ConfirmationModal
                confirmAppointment={confirmAppointment}
                handleAppointmentModalClose={handleAppointmentModalClose}
            />
        </div>
    )
}

export default AppointmentModal
