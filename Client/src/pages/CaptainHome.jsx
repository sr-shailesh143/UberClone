import React, { useRef, useState, useEffect, useContext } from 'react';
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
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState(null);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    useEffect(() => {
        if (!captain) return;

        console.log('Captain data:', captain);

        socket.emit('join', { userId: captain._id, userType: 'captain' });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
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
    }, [captain, socket]);

    useEffect(() => {
        socket.on('new-ride', (data) => {
            setRide(data);
            setRidePopupPanel(true);
        });

        return () => socket.off('new-ride');
    }, [socket]);

    const confirmRide = async () => {
        if (!ride || !captain) {
            console.error('Missing ride or captain data');
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                {
                    rideId: ride._id,
                    captainId: captain._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error('Error confirming ride:', error);
        }
    };

    useGSAP(() => {
        const panelRef = ridePopupPanelRef.current;
        if (panelRef) {
            gsap.to(panelRef, {
                transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)',
                duration: 0.5,
            });
        }
    }, [ridePopupPanel]);

    useGSAP(() => {
        const panelRef = confirmRidePopupPanelRef.current;
        if (panelRef) {
            gsap.to(panelRef, {
                transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)',
                duration: 0.5,
            });
        }
    }, [confirmRidePopupPanel]);

    if (!captain) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                Loading...😒
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <div className="fixed p-6 top-0 flex items-center justify-between w-full bg-white shadow-md z-20">
                <img
                    className="w-16"
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="Uber Logo"
                />
                <Link
                    to="/login"
                    className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded-full"
                >
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className="h-3/5 relative">
                <img
                    className="h-full w-full object-cover"
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt="Map View"
                />
            </div>

            <div className="h-2/5 p-6 bg-white overflow-auto">
                <CaptainDetails />
            </div>

            <div
                ref={ridePopupPanelRef}
                className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-lg"
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            <div
                ref={confirmRidePopupPanelRef}
                className="fixed w-full h-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-lg"
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;
