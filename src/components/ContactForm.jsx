import React from 'react';

const ContactForm = () => {
  return (
    <div className="bg-gray-800 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center bg-gray-900 p-8 rounded-2xl">
        <div className="prose prose-invert">
          <h2 className="text-4xl font-extrabold">We typically respond within 12 - 48 hours</h2>
          <p className="mt-4 text-xl font-semibold text-orange-400">If you do not receive an email, check your SPAM folder</p>
          <p className="mt-4 text-gray-400">
            We only provide support in English. We will translate your message and respond in English if you contact us in another language.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input type="email" id="email" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Your Email" />
            </div>
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input type="text" id="name" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Full Name" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" rows="5" className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Write Message"></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                Send Now →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
