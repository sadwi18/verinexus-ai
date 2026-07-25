import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NetworkBackground from "@/components/NetworkBackground";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-900">
      <div className="absolute inset-0 bg-radial-fade" />
      <NetworkBackground />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}
