import React, { useState } from 'react'

const ConfirmRide = (props) => {
    // Default values for pickup, destination, fare, and vehicleType
    const defaultData = {
        pickup: '562/11-A',
        destination: 'Sadar Bazar, New Delhi',
        fare: {
            sedan: 300,
            suv: 500,
        },
        vehicleType: 'sedan', // Default vehicle type is sedan
    };

    // Using state to manage the default data
    const [rideDetails, setRideDetails] = useState({
        pickup: props.pickup || defaultData.pickup,
        destination: props.destination || defaultData.destination,
        fare: props.fare || defaultData.fare,
        vehicleType: props.vehicleType || defaultData.vehicleType,
    });

    // Handle ride confirmation
    const handleConfirm = () => {
        props.setVehicleFound(true);
        props.setConfirmRidePanel(false);
        props.createRide();
    };

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false);
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{rideDetails.pickup}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{rideDetails.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{rideDetails.destination}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{rideDetails.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{rideDetails.fare[rideDetails.vehicleType]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>
                <button onClick={handleConfirm} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
            </div>
        </div>
    )
}

export default ConfirmRide;
