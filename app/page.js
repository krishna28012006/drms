"use client";  // This must be at the very top

import { useRouter } from "next/navigation";

export default function Home() {
  return (
    <>
      <div className="overflow-hidden bg-white shadow-[0px_3px_6px_rgba(18,15,40,0.12)]">
        {/* Header/Navigation Section */}
        <header className="flex flex-wrap gap-5 justify-between px-6 py-0.5 w-full bg-white shadow-[0px_0px_2px_rgba(23,26,31,0.12)] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-wrap gap-10">
            <div className="flex flex-auto gap-2.5 my-auto text-3xl text-black">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/78f1796dd655a60fd25cf9b7a473bc0f013f7d3c211b35a38f137ad120cdb351?placeholderIfAbsent=true&apiKey=e33f6de605444adab508234fcc8e6ca0"
                className="object-contain shrink-0 my-auto w-9 aspect-square"
                alt="Drainage Health Hub Logo"
              />
              <h1 className="flex-auto">SMART DRAINAGE SYSTEM</h1>
            </div>
          </div>
          <div className="flex gap-4 my-auto text-sm leading-loose">
          <button  onClick={() => window.location.href = '/signup.html'} className="flex overflow-hidden gap-1.5 px-8 py-2 text-white bg-indigo-500 rounded border border-solid border-black border-opacity-0">
             <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a2a6728ccb61accf894477ddc87922440268ed18f3c346bb8288ae4bc96a865?placeholderIfAbsent=true&apiKey=e33f6de605444adab508234fcc8e6ca0"
                className="object-contain shrink-0 my-auto w-4 aspect-square"
                alt="Sign in icon"
              />
              <span>Sign Up</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="overflow-hidden w-full text-white bg-neutral-800 max-md:max-w-full">
          <div className="flex relative flex-col w-full min-h-[640px] max-md:max-w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f970ee125affcc6e7a9b440db166e564e04d0011c4691761bfc55d3719ac5269?placeholderIfAbsent=true&apiKey=e33f6de605444adab508234fcc8e6ca0"
              className="object-cover absolute inset-0 size-full"
              alt="Hero background"
            />
            <div className="flex relative flex-col items-start px-20 pt-72 pb-32 w-full bg-zinc-900 bg-opacity-40 max-md:px-5 max-md:py-24 max-md:max-w-full">
              <div className="flex flex-col items-start mb-0 max-w-full w-[674px] max-md:mb-2.5">
                <h2 className="text-6xl font-bold leading-none max-md:max-w-full max-md:text-4xl">
                  Welcome Back!
                </h2>
                <p className="self-stretch mt-6 text-2xl text-gray-100 max-md:max-w-full">
                  Unlock health insights and personalized care with your account.
                </p>
                <button  onClick={() => window.location.href = '/login.html'} className="flex overflow-hidden gap-1.5 px-8 py-2 text-white bg-indigo-500 rounded border border-solid border-black border-opacity-0">
                Login
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
