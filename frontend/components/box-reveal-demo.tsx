"use client"

import { Button } from "@/components/ui/button"
import { BoxReveal } from "@/components/magicui/box-reveal"

export default function BoxRevealDemo() {
  return (
    <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold">
          Magic UI<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
        Join the community of <span className="text-[#5046e6]">Investor and Entrepreneur</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <div className="mt-6">
          <p>
            -&gt;
            <span className="font-semibold text-[#5046e6]"> Connect</span>,
            <span className="font-semibold text-[#5046e6]"> Collaborate</span>, and
            <span className="font-semibold text-[#5046e6]"> Create</span> in our digital repo-system. <br />
            -&gt; Welcome to the iHive. <br />
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <Button className="mt-[1.6rem] bg-[#5046e6]">Get Started</Button>
      </BoxReveal>
    </div>
  )
}

