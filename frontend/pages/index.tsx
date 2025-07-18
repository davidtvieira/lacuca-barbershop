import Layout, { PageCode } from '../src/components/Layout';
import FirstSection from '../src/components/LandingPage/FirstSection';
import ServicesSection from '../src/components/LandingPage/ServicesSection';
import TeamSection from '../src/components/LandingPage/TeamSection';
import GallerySection from '../src/components/LandingPage/GallerySection';
import ProductsSection from '../src/components/LandingPage/ProductsSection';
import MapSection from '../src/components/LandingPage/MapSection';
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import AboutSection from '../src/components/LandingPage/AboutSection';
import { barberProfiles } from '../src/samples/barberProfiles';

SwiperCore.use([Autoplay, EffectCoverflow, Pagination]);

const services = [
  {
    src: '/static/services/Fade.svg',
    size: {
      height: 88,
      width: 84,
    },
    title: 'Corte Fade',
    description: 'Experimenta os melhores fades',
  },
  {
    src: '/static/services/Drawing.svg',
    size: {
      height: 115,
      width: 95,
    },
    title: 'Desenhos',
    description: 'Personaliza-te com um look único',
  },
  {
    src: '/static/services/Cleaning.svg',
    size: {
      height: 66,
      width: 91,
    },
    title: 'Limpeza de Pele',
    description: 'Hidratação, limpeza e máscara',
  },
  {
    src: '/static/services/Beard.svg',
    size: {
      height: 52,
      width: 155,
    },
    title: 'Barbaterapia',
    description: 'Barba alinhada, hidratação e libertação de stress',
  },
];

export default function Index() {
  return (
    <Layout pageTitle='Lacucaracha Barbershop' activePageCode={PageCode.HOME} disablePadding={true}>
      <FirstSection />
      <ServicesSection services={services} />
      <TeamSection teamMembers={barberProfiles} />
      <GallerySection />
      <ProductsSection />
      <AboutSection />
      <MapSection />
    </Layout>
  );
}
