import React from 'react';
import Reveal from './Reveal';

const TestimonialCard = ({ name, handle, title, date, text }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    {/* Top Section */}
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
        {name[0]}
      </div>
      <div className="ml-3">
        <p className="text-sm font-semibold text-gray-900">{handle}</p>
        <p className="text-xs text-gray-500">{title}</p>
      </div>
    </div>

    {/* Stars */}
    <div className="flex text-yellow-400 text-lg mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>

    {/* Text */}
    <p className="text-gray-700 text-sm leading-relaxed">{text}</p>

    {/* Date */}
    <p className="mt-3 text-xs text-gray-400">{date}</p>
  </div>
);

const Testimonials = () => {
  const testimonialsData = [
    {
      name: 'J',
      handle: '@jayden_lol',
      title: 'Business Major, 2nd Year',
      date: 'Jul 4, 2023',
      text: 'bro. 100Write just saved me from getting cooked by TurnItIn 🤓 ran my whole essay thru it and my prof said “great insights” LMAO bless this tool fr 💯',
    },
    {
      name: 'C',
      handle: '@cramqueen69',
      title: 'Probably Writing This At 2AM',
      date: 'Jun 27, 2023',
      text: 'i was this close 🤏 to rewriting my whole research paper then someone in class sent me 100Write...i owe them snacks for life. this thing WORKS.',
    },
    {
      name: 'D',
      handle: '@dan.is.delulu',
      title: 'Economics Major, 3rd year',
      date: 'Jun 27, 2023',
      text: 'why’s nobody talking about 100Write?? like bro it literally turned my robotic essay into the most “deeply personal reflection” my TA ever read 🥲',
    },
    {
      name: 'N',
      handle: '@Neha S.',
      title: 'B.A. Psychology, Delhi University',
      date: 'Jul 4, 2023',
      text: 'idk what kind of sorcery this is but my 100% ChatGPT essay passed GPTZero & TurnItIn 🤯 100Write got me feeling like a ghostwriting god.',
    },
    {
      name: 'Z',
      handle: '@Zara Ahmed',
      title: '3rd Year Lit Major, NYU',
      date: 'Mar 26, 2023',
      text: 'used 100Write 20 mins before deadline. no AI flag. GPA safe. anxiety gone. professor? confused. me? thriving 💅',
    },
    {
      name: 'A',
      handle: '@Ananya P',
      title: 'Political Sci @ JNU',
      date: 'Mar 26, 2023',
      text: '100Write is my emotional support toolkit humanized my AI essay AND my soul tbh 10/10 would risk academic probation again',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFF7F2] to-[#FFF7F2] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Over <span className="bg-primary-light text-primary px-2 py-1 rounded-md font-body">5,000,000+</span> Students and writers use 100 Write.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Essays, journals, even viral blogs—100 Write made them all sound human. <br />
            <span className="font-semibold">Professors and AI detectors? Fooled every time.</span>
          </p>

          {/* Button */}
          <div className="mt-6">
            <a
              href="#"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-hover shadow-md font-body"
            >
              Start Now - For Free →
            </a>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
