"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { AuthForm } from "@/components/auth-form";
import { useState } from "react";

export function BoxRevealDemo() {
  const [showAuthForm, setShowAuthForm] = useState(false);

  return (
    <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold">
          iHive<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
          Welcome to the iHive.
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <div className="mt-6">
          <p>
            -&gt; <span className="font-semibold text-[#5046e6]">Connect</span>, <span className="font-semibold text-[#5046e6]">Collaborate</span>, and <span className="font-semibold text-[#5046e6]">Create</span> in our digital repo-system. <br />
            -&gt; Join the community of <span className="font-semibold text-[#5046e6]">Investors</span> and <span className="font-semibold text-[#5046e6]">Entrepreneurs</span> <br />
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <div className="mt-[1.6rem] flex gap-4">
          <Link href="/">
            <Button 
              className="bg-white text-[#5046e6] border-2 border-[#5046e6] px-8 py-2 rounded-lg 
                transition-all duration-300 ease-in-out
                hover:bg-[#5046e6] hover:text-white hover:shadow-lg hover:shadow-[#5046e6]/30
                active:scale-95 active:shadow-md
                focus:outline-none focus:ring-2 focus:ring-[#5046e6] focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
                title="Home"
            >
              Get Started
            </Button>
          </Link>
          <Button 
            className="bg-[#5046e6] text-white px-8 py-2 rounded-lg 
              transition-all duration-300 ease-in-out
              hover:bg-[#4338ca] hover:shadow-lg hover:shadow-[#5046e6]/30
              active:scale-95 active:shadow-md
              focus:outline-none focus:ring-2 focus:ring-[#5046e6] focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowAuthForm(true)}
            title="Login/Signup"
          >
            Join Now
          </Button>
        </div>
      </BoxReveal>

      {showAuthForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative">
            <AuthForm 
              initialView="login"
              onClose={() => setShowAuthForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
