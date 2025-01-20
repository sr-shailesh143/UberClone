import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext);

    if (!captain || !captain.fullname) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Loading captain details...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg max-w-xxl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-300"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbbjUOZqLht6UbeQdaEG2HjoGh2dBDvT-jDAM0IZu57t-eHvKqlMWIXRq9dAIpQ8UbcKE&usqp=CAU"
                        alt="Captain"
                    />
                    <div>
                        <h4 className="text-lg font-semibold capitalize text-gray-800">
                            {captain.fullname.firstname} {captain.fullname.lastname}
                        </h4>
                        <p className="text-sm text-gray-500">Captain</p>
                    </div>
                </div>
                <div className="text-right">
                    <h4 className="text-xl font-bold text-green-600">₹18,000.20</h4>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <i className="text-3xl text-blue-500 ri-timer-2-line mb-2"></i>
                    <h5 className="text-lg font-medium">10.2</h5>
                    <p className="text-sm text-gray-500">Hours Online</p>
                </div>
                <div className="text-center">
                    <i className="text-3xl text-purple-500 ri-speed-up-line mb-2"></i>
                    <h5 className="text-lg font-medium">120</h5>
                    <p className="text-sm text-gray-500">Rides Completed</p>
                </div>
                <div className="text-center">
                    <i className="text-3xl text-yellow-500 ri-booklet-line mb-2"></i>
                    <h5 className="text-lg font-medium">4.9</h5>
                    <p className="text-sm text-gray-500">Average Rating</p>
                </div>
            </div>
        </div>
    );
};

export default CaptainDetails;