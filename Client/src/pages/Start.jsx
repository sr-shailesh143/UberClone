import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XXr1i3hU5wJ3wwar5H3ru2mnS8V0Q8HWvg&s)] h-screen pt-8 flex flex-col justify-between w-full'>
        {/* Logo Section */}
        <div className='flex items-center justify-between px-8'>
          <img 
            className='w-16' 
            src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" 
            alt="Uber Logo" 
          />
          {/* <button className='bg-white text-black px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-200'>Sign Up</button> */}
        </div>

        {/* Main Content Section */}
        <div className='bg-gradient-to-t from-white via-gray-100 to-transparent pb-8 py-6 px-6 shadow-lg rounded-t-xl'>
          <h2 className='text-[32px] font-bold text-black'>Get Started with Uber</h2>
          <p className='text-gray-600 mt-2'>Your journey begins here. Explore the world at your fingertips.</p>

          <Link 
            to='/login' 
            className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5 shadow-lg hover:bg-gray-800 transition duration-300'>
            🚀 Continue 🚀
          </Link>

          <div className='mt-6'>
            <h3 className='text-lg font-semibold text-gray-800'>Why choose Uber?</h3>
            <ul className='mt-4 space-y-3'>
              <li className='flex items-center'>
                <span className='text-green-500 mr-3'>✓</span>
                <span>Reliable rides anytime, anywhere</span>
              </li>
              <li className='flex items-center'>
                <span className='text-green-500 mr-3'>✓</span>
                <span>Safe and comfortable journeys</span>
              </li>
              <li className='flex items-center'>
                <span className='text-green-500 mr-3'>✓</span>
                <span>Transparent pricing and multiple options</span>
              </li>
            </ul>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Start;