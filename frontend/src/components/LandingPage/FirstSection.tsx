import landingWelcomeImage from '../../../public/static/LogoGreen.png';
import { Typography, Button, Grid, Box, Container } from '@mui/material';
import { PlayCircleFilled } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

export default function FirstSection() {
  return (
    <Container>
      <Box sx={{ display: 'flex' }}>
        <Grid
          container
          alignItems='center'
          justifyContent='center'
          textAlign={{ xs: 'center', md: 'left' }}
          p='0px 0px 40px 0px'
        >
          <Grid item sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box sx={{ maxWidth: '400px' }}>
              <Image src={landingWelcomeImage} alt='Foto de corte' priority />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              fontStyle={'italic'}
              fontWeight={'light'}
              gutterBottom
              sx={{ fontSize: { xs: '25px', sm: '30px', md: '40px' } }}
            >
              "O Cabelo é a Moldura do Rosto, cuida Dele."
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Link href='/agendar' passHref>
                  <Button sx={{ fontSize: '20px', padding: '8px 30px' }} variant='contained' fullWidth>
                    Agendar
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  disabled
                  startIcon={<PlayCircleFilled />}
                  sx={{ fontSize: '20px', padding: '8px 30px' }}
                  variant='outlined'
                  fullWidth
                >
                  Apresentação
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ marginLeft: '100px' }}>
              <Image src={landingWelcomeImage} alt='Foto de corte' priority />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
