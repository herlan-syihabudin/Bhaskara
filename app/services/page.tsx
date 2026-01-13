import ServicesHero from "@/components/services/ServicesHero";
import ServiceList from "@/components/services/ServiceList";
import CallToAction from "@/components/home/CallToAction";

export default function ServicesPage() {
  return (
    <>
      {/* HERO */}
      <ServicesHero />

      {/* SERVICES OVERVIEW */}
      <ServiceList />

      {/* CTA */}
      <CallToAction />
    </>
  );
}
