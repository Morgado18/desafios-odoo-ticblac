'use client'
import { ContactSection } from "@/components/landing/sections/ContactSection";
import { FAQSection } from "@/components/landing/sections/faq";
import { FooterSection } from "@/components/landing/sections/footer";
import { HeroSection } from "@/components/landing/sections/hero";
import { JoinSection } from "@/components/landing/sections/join";
import { TestimonialSection } from "@/components/landing/sections/testimonial";
import { HowItWorksSection } from "@/components/landing/sections/what";



export default function Home() {


  return (
    <main className="max-w-full overflow-hidden">
      <HeroSection />

      <HowItWorksSection />

      <JoinSection />

      <TestimonialSection />

      <FAQSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
