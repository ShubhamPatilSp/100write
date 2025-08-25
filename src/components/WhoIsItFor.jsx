import React from 'react';

const Card = ({ title, description }) => (
  <div className="bg-white rounded-2xl p-6 border-4 border-orange-500 shadow-lg">
    <div className="text-center mb-4">
      <span className="text-6xl" role="img" aria-label="pencil">✏️</span>
    </div>
    <div className="flex items-center mb-2">
      <div className="w-3 h-3 bg-orange-500 mr-2"></div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const WhoIsItFor = () => {
  const cards = [
    { title: 'Students', description: 'Use 100Write to strengthen your writing skills and work smarter. Our tool helps you create high-quality content while encouraging ethical and responsible use—boosting both your confidence and productivity.' },
    { title: 'Blog Writers', description: 'Improve your SEO rankings effortlessly. 100Write helps you produce engaging, authentic-sounding blog posts that pass search engine checks without losing your unique voice.' },
    { title: 'Freelancers', description: 'Deliver top-notch work to your clients—on time, every time. 100Write enables freelancers to create high-quality content that bypasses AI detection while maintaining originality and accuracy.' },
    { title: 'E-commerce Entrepreneurs', description: 'From product descriptions to marketing copy, 100Write makes it easy to craft words that sell. Engage your customers, improve conversions, and keep your store\'s content fresh.' },
    { title: 'Marketing Professionals', description: 'Create powerful campaigns and scroll-stopping social media posts with 100Write. Our AI-powered assistance helps you connect with your audience and amplify your brand message.' },
    { title: 'Publishers', description: 'Keep readers hooked and traffic flowing. 100Write helps you produce captivating, publication-ready content that avoids detection by AI filters—so your work stays impactful and visible.' },
  ];

  return (
    <div className="py-16 px-4">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who is 100Write Built For?</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          100Write is trusted by a diverse community of users who want to boost productivity and produce top-quality content. From students and bloggers to SEO experts, e-commerce entrepreneurs, marketers, and publishers—our tool is built to help everyone write smarter and faster.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
};

export default WhoIsItFor;
