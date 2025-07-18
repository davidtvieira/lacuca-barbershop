import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  Paper,
  Stack,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { barberProfiles } from '../../samples/barberProfiles';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { Instagram } from '@mui/icons-material';

SwiperCore.use([Autoplay, EffectCoverflow]);

export default function ProfileDialog(props: any) {
  const { onClose, selectedBarber, open } = props;

  const [readMore, setReadMore] = useState(false);

  if (!selectedBarber) {
    return (
      <Dialog onClose={onClose} open={open}>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Dialog>
    );
  }

  const barberProfile = barberProfiles.find((barber: any) => barber.uid == selectedBarber.uid);

  return (
    <Dialog onClose={onClose} open={open}>
      <Paper sx={{ padding: 3, maxWidth: '544px' }}>
        {barberProfile ? (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Avatar sx={{ width: '120px', height: '120px' }} src={barberProfile.profilePhoto} />
              <Stack>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{
                    '& a': {
                      color: 'rgb(0 0 0 / 87%)',
                      textDecoration: 'none',
                    },
                  }}
                >
                  <Typography fontWeight='light' fontSize='18px' sx={{ textTransform: 'uppercase' }}>
                    {selectedBarber.firstName} {selectedBarber.lastName}
                  </Typography>
                  <a
                    target='_blank'
                    href={`https://instagram.com/${barberProfile.instagram}`}
                    rel='noopener noreferrer'
                  >
                    <Instagram />
                  </a>
                </Stack>
                <Collapse in={readMore} collapsedSize={73}>
                  <Typography fontWeight='light' fontSize='14px'>
                    {barberProfile.description}
                  </Typography>
                </Collapse>
                <Box mt={1} sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Button variant='text' onClick={() => setReadMore(!readMore)}>
                    {readMore ? 'Diminuir' : 'Saber mais'}
                  </Button>
                </Box>
              </Stack>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Box width='100%'>
              <Swiper
                autoplay={{
                  delay: 2000,
                }}
                breakpoints={{
                  '0': {
                    slidesPerView: 1,
                  },
                  '450': {
                    slidesPerView: 2,
                  },
                }}
                spaceBetween={75}
                centeredSlides={true}
                coverflowEffect={{ rotate: 0, slideShadows: false, depth: 50 }}
                effect='coverflow'
              >
                {barberProfile?.photos.map((photoPath: string, index: number) => (
                  <SwiperSlide key={`gallery_slide_${index}`}>
                    <Box
                      width='100%'
                      minHeight='230px'
                      display='flex'
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='center'
                      m='0px 0px 50px 0px'
                    >
                      <Image src={photoPath} layout='fill' objectFit='cover' />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </>
        ) : (
          <Typography fontWeight='light' fontSize='18px' sx={{ textTransform: 'uppercase' }}>
            Este barbeiro ainda não tem um perfil associado.
          </Typography>
        )}
      </Paper>
    </Dialog>
  );
}
