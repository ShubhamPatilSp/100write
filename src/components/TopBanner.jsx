import React from 'react';
import Link from 'next/link';

const TopBanner = () => {
  return (
    <div className="bg-orange-500 text-white py-2.5 text-center text-sm font-medium">
      <span>Summer Special Flash Sale <span className="bg-white text-orange-500 font-bold px-2 py-1 rounded-md">50% Off!</span> Don't missout - offer ends in</span>
      <Link href="/dashboard" className="ml-4 bg-white text-orange-500 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100">
        Claim Offer &gt;
      </Link>
    </div>
  );
};

export default TopBanner;
