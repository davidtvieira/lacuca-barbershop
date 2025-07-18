import Layout, { PageCode } from '../src/components/Layout';
import { Stack, Typography, Box, Container, Divider, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import Shaver2 from '../public/static/sections/Shaver2.png';
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { products } from '../src/samples/products';

SwiperCore.use([Autoplay, EffectCoverflow, Pagination]);

export default function Precario() {
  return (
    <Layout pageTitle='Preçário | Lacucaracha Barbershop' activePageCode={PageCode.PRICING} disablePadding={true}>
      <Stack bgcolor='white' justifyContent='center' alignItems='center' textAlign='center'>
        <Box justifyContent='center' padding='70px'>
          <Typography fontWeight='light' fontSize='30px'>
            PREÇÁRIO
          </Typography>
        </Box>

        <Container
          sx={{
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            display: 'flex',
            textAlign: 'center',
          }}
        >
          <Stack
            boxShadow='6'
            bgcolor='white'
            flex='1'
            display='flex'
            flexDirection='column'
            padding='50px'
            marginRight={{ sm: '0px', md: '20px' }}
            marginBottom={{ xs: '30px', sm: '30px', md: '0px' }}
          >
            <Stack flexDirection='row' paddingBottom='10px'>
              <Box flex='2' alignItems='center' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Corte Cabelo Simples
                </Typography>
                <Typography fontWeight='light' fontSize='15px'>
                  Para os mais clássicos
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  10€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack paddingTop='10px' paddingBottom='10px' flexDirection='row'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Corte Cabelo Degradê/Fade
                </Typography>
                <Typography fontWeight='light' fontSize='15px'>
                  Experimenta os melhores fades
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  12€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack paddingTop='10px' paddingBottom='10px' flexDirection='row'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Corte Cabelo Degradê/Fade Shaver
                </Typography>
                <Typography fontWeight='light' fontSize='15px'>
                  Experimenta os melhores fades
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  13€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack paddingTop='10px' paddingBottom='10px' flexDirection='row'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Corte Completo (Cabelo e Barba)
                </Typography>
                <Typography fontWeight='light' fontSize='15px'>
                  Renova o teu look
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  18€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack paddingTop='10px' paddingBottom='10px' flexDirection='row'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Corte Completo (Cabelo, Barba e Sobrancelha)
                </Typography>
                <Typography fontWeight='light' fontSize='15px'>
                  Renova o teu look
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  20€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack paddingTop='10px' paddingBottom='10px' flexDirection='row'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Corte Premium
                </Typography>
                <Typography fontWeight='light' fontSize='15px'>
                  Cabelo, barbaterapia e limpeza de pele
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  30€
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack
            boxShadow='6'
            bgcolor='white'
            flex='1'
            display='flex'
            flexDirection='column'
            padding='50px'
            marginRight={{ xs: '0px', sm: '0px', md: '20px' }}
          >
            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Desenhos
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  5€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Pigmentação por Zona
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  5€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Barba
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  7,5€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Arranjos
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  7,5€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Desfrisagem
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  10€
                </Typography>
              </Box>
            </Stack>
            <Divider />

            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Madeixas
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  35€
                </Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack flexDirection='row' alignItems='center'>
              <Box flex='2' sx={{ textAlign: 'left' }}>
                <Typography fontWeight='light' fontSize='20px'>
                  Platinar
                </Typography>
              </Box>
              <Box flex='1' sx={{ textAlign: 'right' }}>
                <Typography fontWeight='light' fontSize='35px'>
                  40€
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Container>
        <Box padding='50px'>
          <Link href='/agendar' passHref>
            <Button size='large' variant='contained'>
              AGENDAR
            </Button>
          </Link>
        </Box>
      </Stack>

      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: { xs: 'center', md: 'right' },
          justifyContent: 'center',
        }}
      >
        <Box sx={{ opacity: '50%', display: { xs: 'none', md: 'flex' } }}>
          <Image objectPosition='0px -80px' height='400px' src={Shaver2} objectFit='cover' />
        </Box>
        <Box sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
          <Typography fontSize='25px' fontWeight='light' sx={{ textTransform: 'uppercase' }} gutterBottom>
            A máxima qualidade
          </Typography>
          <Typography fontSize='22px' fontWeight='light'>
            Completa o serviço com um dos nossos produtos
          </Typography>
        </Box>
      </Container>

      <Box padding='40px 0px' bgcolor='secondary.main'>
        <Container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
          <Typography variant='h5' fontWeight='light' sx={{ textTransform: 'uppercase' }}>
            Produtos La Cucaracha
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
                    <Typography variant='body1' fontWeight='thin'>
                      {product.price}€
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}
