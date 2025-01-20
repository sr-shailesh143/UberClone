import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(true);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState(null);
    const [showRidePopup, setShowRidePopup] = useState(true);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    const captainData = captain || {
        _id: 'defaultCaptainId',
        name: 'Default Captain',
        vehicle: {
            color: 'white',
            plate: 'XYZ-1234',
            capacity: 4,
            vehicleType: 'car',
        }
    };

    const currentRide = ride || {
        _id: 'actualRideId12345', // Replace with a valid ride ID
        user: { _id: 'defaultUserId', name: 'Default User' },
        pickup: 'Default Pickup Location',
        destination: 'Default Destination Location',
        fare: 50,
        status: 'waiting',
    };

    // Emit join event and update captain location periodically
    useEffect(() => {
        if (captainData._id) {
            socket.emit('join', {
                userId: captainData._id,
                userType: 'captain',
            });

            const updateLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        socket.emit('update-location-captain', {
                            userId: captainData._id,
                            location: {
                                ltd: position.coords.latitude,
                                lng: position.coords.longitude,
                            },
                        });
                    });
                }
            };

            const locationInterval = setInterval(updateLocation, 10000);
            updateLocation();

            return () => clearInterval(locationInterval);
        }
    }, [captainData, socket]);

    // Listen for new ride events
    useEffect(() => {
        socket.on('new-ride', (data) => {
            setRide(data);
            setRidePopupPanel(true);
        });

        return () => {
            socket.off('new-ride');
        };
    }, [socket]);

    // Confirm ride API call
    const confirmRide = async () => {
        const rideId = currentRide?._id;
        console.log('Confirming ride with ID:', rideId);  // Log to ensure it's a valid ID
    
        if (!rideId) {
            console.error('Invalid ride ID.');
            return;
        }
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: rideId,
                captainId: captainData?._id || '',  // Ensure this is a valid captain ID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,  // Ensure token is valid
                },
            });
    
            // Handle success
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error('Failed to confirm ride:', error);
            if (error.response) {
                console.log('Error Response:', error.response.data);  // Inspect the full error message
            }
        }
    };

    // GSAP animations
    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)',
        });
    }, [ridePopupPanel]);

    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)',
        });
    }, [confirmRidePopupPanel]);

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img
                    className='w-16'
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="Uber Logo"
                />
                <Link
                    to='/captain-home'
                    className='h-10 w-10 bg-white flex items-center justify-center rounded-full'
                >
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img
                    className='h-full w-full object-cover'
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt=""
                />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails captain={captainData} />
            </div>
            <div
                ref={ridePopupPanelRef}
                className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                {showRidePopup && (
                    <RidePopUp
                        ride={currentRide}
                        setRidePopupPanel={setShowRidePopup}
                        setConfirmRidePopupPanel={setShowConfirmPopup}
                        confirmRide={confirmRide}
                    />
                )}
            </div>
            <div
                ref={confirmRidePopupPanelRef}
                className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                {showConfirmPopup && (
                    <ConfirmRidePopUp
                        setRidePopupPanel={setRidePopupPanel}
                        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    />
                )}
            </div>
        </div>
    );
};

export default CaptainHome;
