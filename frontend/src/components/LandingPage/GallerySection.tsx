import { Typography, Box, Container } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { barberProfiles } from '../../samples/barberProfiles';

export default function GallerySection() {
  return (
    <Box padding='40px 0px' bgcolor='secondary.main'>
      <Container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
        <Typography variant='h5' fontWeight='light' sx={{ textTransform: 'uppercase' }}>
          Galeria
        </Typography>
        <Box width='100%' m='50px 0px'>
          <Swiper
            autoplay={{
              delay: 2500,
            }}
            breakpoints={{
              '0': {
                slidesPerView: 1,
              },
              '450': {
                slidesPerView: 2,
              },
              '700': {
                slidesPerView: 3,
              },
            }}
            spaceBetween={75}
            centeredSlides={true}
            coverflowEffect={{ rotate: 0, slideShadows: false, depth: 50 }}
            effect='coverflow'
          >
            {barberProfiles.map((barber, index) =>
              barber.photos.map((photo, secondIndex) => (
                <SwiperSlide key={`landing_gallery_slide_${index}_${secondIndex}`}>
                  <Box
                    width='100%'
                    minHeight='400px'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    m='0px 0px 50px 0px'
                  >
                    <Image src={photo} layout='fill' objectFit='cover' quality={40} />
                  </Box>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
}
