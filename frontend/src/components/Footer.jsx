import {
  FaFacebook,
  FaTiktok,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa'

import LOGOWHITE from "../assets/LOGOWHITE.svg"

export default function Footer() {
  return (
    <footer className="bg-[#006A71] py-4 md:py-12 text-white">
      <div
        className="w-full h-[30vh] flex justify-between flex-wrap px-15
          mx-auto
          md:h-[27vh]
          lg:h-[22vh]
          xl:h-[27vh]
          2xl:h-[27vh]
          max-w-screen-2xl"
      >
        {/* Follow us */}
      <div className='flex flex-row space-x-3'>
        <div
          className="flex flex-col p-4 transition-all duration-300 ease-out footer-1
          text-sm sm:text-base
          md:text-lg
          lg:text-sm
          xl:text-lg
          2xl:text-xl"
        >
          <h2
            className="mb-4 text-2xl md:text-3xl font-medium"
          >
            Follow us
          </h2>

          {/* Only Icon links now, always visible */}
          <div className="flex space-x-4 text-2xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl">
            <a
              href="#"
              className="fb hover:text-white transition-all duration-300 ease-out"
              style={{
                filter: 'drop-shadow(0 0 10px blue)',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px blue)')}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <FaFacebook size={20}/>
            </a>
            <a
              href="#"
              className="tt hover:text-white transition-all duration-300 ease-out"
              style={{
                filter: 'drop-shadow(0 0 10px #25F4EE)',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px #25F4EE)')}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <FaTiktok size={20}/>
            </a>
            <a
              href="#"
              className="ig hover:text-white transition-all duration-300 ease-out"
              style={{
                filter: 'drop-shadow(0 0 10px #E1306C)',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px #E1306C)')}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <FaInstagram size={22}/>
            </a>
            <a
              href="#"
              className="yt hover:text-white transition-all duration-300 ease-out"
              style={{
                filter: 'drop-shadow(0 0 10px red)',
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px red)')}
              onMouseLeave={e => (e.currentTarget.style.filter = '')}
            >
              <FaYoutube size={24}/>
            </a>
          </div>
        </div>

        {/* Find us */}
        <div
          className="flex flex-col p-4 transition-all duration-300 ease-out
          text-sm sm:text-base
          md:text-lg
          lg:text-sm
          xl:text-lg
          2xl:text-xl
          max-w-xs"
        >
          <h2 className="mb-4 text-2xl md:text-3xl font-medium">Find us</h2>
          <p className="mb-2 text-sm">
            ADDRESS:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://maps.app.goo.gl/thNApLHWzUwwCSbZ7"
              className="font-light hover:text-[#2dc5d6] transition-all duration-300 ease-out"
            >
              Caraga State University, Brgy. Ampayon, Butuan City
            </a>
          </p>
          <p className="mb-2 text-sm">
            EMAIL:{' '}
            <a
              href="mailto:robec@carsu.edu.ph"
              className="font-light hover:text-[#2dc5d6] transition-all duration-300 ease-out"
            >
              robec@carsu.edu.ph
            </a>
          </p>
          <p className='text-sm'>
            CONTACT NO:{' '}
            <a
              href="tel:09123456789"
              className="font-light hover:text-[#2dc5d6] transition-all duration-300 ease-out"
            >
              09123456789
            </a>
          </p>
        </div>
      </div>

        {/* RoboCore */}
        <div
          className="flex flex-col p-4 transition-all duration-300 ease-out
          text-sm sm:text-base
          md:text-lg
          lg:text-sm
          xl:text-lg
          2xl:text-xl
          max-w-xs
          items-center"
        >
          <h2
            className="mb-4 text-2xl md:text-3xl font-medium">
            RoboCore
          </h2>
          <img
            src={LOGOWHITE}
            alt="RoboCore Logo"
            className="w-20 md:w-24 mb-4"
          />
          <p className="text-xs mt-2">
            © RoboCore 2025. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
