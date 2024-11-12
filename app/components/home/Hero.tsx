import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroButtonProps {
  variant: 'primary' | 'secondary';
  href: string;
  children: React.ReactNode;
}

const HeroButton: React.FC<HeroButtonProps> = ({ variant, href, children }) => {
  return (
    <Link 
      href={href}
      className={`
        inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200
        ${variant === 'primary' 
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl' 
          : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
        }
      `}
    >
      {children}
    </Link>
  );
};

const Hero = () => {
  return (
    <section className=" bg-gradient-to-b from-orange-50 to-white">

      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 ">
          {/* Left side content */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/logo.svg"
                alt="Recy Logo"
                width={200}
                height={80}
                priority
                className="w-48 sm:w-56 lg:w-64"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
                Share Your
                <span className="block text-orange-500">Culinary Magic</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                Join a vibrant community of food enthusiasts where every recipe tells a story. 
                Share your creations, discover new flavors, and inspire others in their cooking journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <HeroButton variant="primary" href="/start-cooking">
                  Start Cooking
                </HeroButton>
                <HeroButton variant="secondary" href="/browse">
                  Browse Recipes
                </HeroButton>
              </div>
              
              {/* Stats */}
              {/* <div className="flex justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-orange-500">15k+</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-orange-500">50k+</p>
                  <p className="text-sm text-gray-600">Recipes Shared</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right side image */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none z-10">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/food-dish.png"
                alt="Delicious food dish"
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 80vw, 40vw"
                priority
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating elements */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Featured Recipe</p>
                    <p className="text-sm text-gray-600">Mediterranean Delight</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;