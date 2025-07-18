import { Typography, Box, Container, Avatar } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function TeamSection({ teamMembers }: any) {
  return (
    <Box padding='40px 0px'>
      <Container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
        <Typography variant='h5' fontWeight='light' sx={{ textTransform: 'uppercase' }}>
          Equipa
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
                slidesPerView: 3,
              },
              '1200': {
                slidesPerView: 5,
              },
            }}
          >
            {teamMembers.map((barber: any, index: number) => (
              <SwiperSlide key={`barber_slide_${index}`}>
                <Box
                  width='100%'
                  display='flex'
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  m='0px 0px 50px 0px'
                >
                  <Avatar
                    src={barber.profilePhoto}
                    sx={{
                      width: '180px',
                      height: '180px',
                      ['& img']: {
                        objectFit: 'unset',
                      },
                    }}
                  />
                  <Typography variant='body1' fontWeight='bold' margin='15px 0px'>
                    {barber.nameForLanding}
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
