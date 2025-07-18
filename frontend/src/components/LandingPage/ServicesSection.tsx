import { Typography, Box, Container } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export default function ServicesSection({ services }: any) {
  return (
    <Box padding='40px 0px' bgcolor='secondary.main' id='services' sx={{ scrollMarginTop: { xs: '56px', sm: '64px' } }}>
      <Container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
        <Typography variant='h5' fontWeight='light' sx={{ textTransform: 'uppercase' }}>
          Serviços
        </Typography>
        <Box
          width='100%'
          m='50px 0px'
          sx={{
            ['& .swiper-pagination-bullet-active']: {
              backgroundColor: 'primary.main',
            },
          }}
        >
          <Swiper
            autoplay={{
              delay: 2500,
            }}
            pagination={{ clickable: true }}
            slidesPerView={1}
            breakpoints={{
              '0': {
                slidesPerView: 1,
              },
              '900': {
                slidesPerView: 1,
              },
              '1200': {
                slidesPerView: 4,
              },
            }}
          >
            {services.map((service: any, index: number) => (
              <SwiperSlide key={`service_slide_${index}`}>
                <Box
                  width='100%'
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  m='0px 0px 50px 0px'
                >
                  <Box minHeight='150px' display='flex' alignItems='center'>
                    <Image src={service.src} height={service.size.height} width={service.size.width} />
                  </Box>
                  <Typography variant='body1' fontWeight='bold' margin='15px 0px' maxWidth='236px'>
                    {service.title}
                  </Typography>
                  <Typography fontSize='18px' minHeight='66px' maxWidth='236px'>
                    {service.description}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </Box>
  );
}
