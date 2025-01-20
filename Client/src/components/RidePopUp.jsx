import React, { useEffect, useState } from 'react';

const RidePopUp = (props) => {
    const defaultUser = {
        fullname: {
            firstname: 'John',
            lastname: 'Doe',
        },
    };

    const defaultRide = {
        user: defaultUser,
        pickup: '123 Default St',
        destination: '456 Default Ave',
        fare: 100,
        _id: null, // Default to null for invalid rides
    };

    const [rideData, setRideData] = useState(defaultRide);

    useEffect(() => {
        if (props.ride) {
            setRideData(props.ride);
        }
    }, [props.ride]);

    const handleAccept = () => {
        if (!rideData._id) {
            alert('Invalid ride ID. Cannot confirm the ride.');
            return;
        }

        if (props.confirmRide) {
            props.confirmRide(rideData._id); // Pass rideId to the confirmRide function
        }

        props.setConfirmRidePopupPanel(true);
    };

    const handleIgnore = () => {
        props.setRidePopupPanel(false);
    };

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setRidePopupPanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>
            <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 rounded-full object-cover w-12"
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt=""
                    />
                    <h2 className="text-lg font-medium">
                        {rideData.user?.fullname?.firstname || 'John'}{' '}
                        {rideData.user?.fullname?.lastname || 'Doe'}
                    </h2>
                </div>
                <h5 className="text-lg font-semibold">2.2 KM</h5>
            </div>
            <div className="flex gap-2 justify-between flex-col items-center">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Pickup: {rideData.pickup}</h3>
                            <p className="text-sm -mt-1 text-gray-600">{rideData.pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Destination: {rideData.destination}</h3>
                            <p className="text-sm -mt-1 text-gray-600">{rideData.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">₹{rideData.fare}</h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 w-full">
                    <button
                        onClick={handleAccept}
                        className="bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg"
                    >
                        Accept
                    </button>

                    <button
                        onClick={handleIgnore}
                        className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg"
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RidePopUp;
