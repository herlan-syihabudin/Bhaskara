import ServicesHero from "@/components/services/ServicesHero";
import ServiceList from "@/components/services/ServiceList";
import ServiceDetail from "@/components/services/ServiceDetail";
import CallToAction from "@/components/home/CallToAction";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceList />
      <ServiceDetail />
      <CallToAction />
    </>
  );
}
