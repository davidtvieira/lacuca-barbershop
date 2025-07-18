import { Typography, Box, Container } from '@mui/material';
import ProductsSectionSeparator from './ProductsSectionSeparator';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { products } from '../../../samples/products';

export default function ProductsSection() {
  return (
    <>
      <ProductsSectionSeparator />
      <Box padding='40px 0px' bgcolor='secondary.main'>
        <Container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
          <Typography variant='h5' fontWeight='light' sx={{ textTransform: 'uppercase' }}>
            Produtos
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
              pagination={{ clickable: true }}
            >
              {products.map((product, index) => (
                <SwiperSlide key={`product_slide_${index}`}>
                  <Box
                    width='100%'
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    m='0px 0px 50px 0px'
                  >
                    <Image src={product.photo} height='300px' width='300px' />
                    <Typography variant='body1' fontWeight='bold' margin='15px 0px'>
                      {product.name}
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Container>
      </Box>
    </>
  );
}
