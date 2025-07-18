import { Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: { xs: 'center', md: 'left' },
        alignItems: { xs: 'center', md: 'flex-start' },
        justifyContent: 'center',
        padding: '40px 0px',
        minHeight: '369px',
        background: { xs: 'none', md: 'url("/static/sections/Scissor.png") no-repeat right' },
        backgroundSize: {
          xs: 'contain',
          md: 'auto',
        },
      }}
    >
      <Typography fontSize='30px' fontWeight='light' sx={{ textTransform: 'uppercase' }} gutterBottom>
        Sobre a La Cucaracha
      </Typography>
      <Typography fontSize='25px' fontWeight='light' pb={4}>
        A história da barbearia
      </Typography>
      <Link href='/sobre' passHref>
        <Button sx={{ fontSize: '20px', padding: '8px 30px' }} variant='contained' color='secondary'>
          História
        </Button>
      </Link>
    </Container>
  );
}
