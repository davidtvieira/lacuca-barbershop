import { Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function ProductsSectionSeparator() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: { xs: 'center', md: 'right' },
        alignItems: { xs: 'center', md: 'flex-end' },
        justifyContent: 'center',
        padding: '40px 0px',
        minHeight: '369px',
        background: { xs: 'none', md: 'url("/static/sections/Product.png") no-repeat left' },
        backgroundSize: {
          xs: 'contain',
          md: 'auto',
        },
      }}
    >
      <Typography fontSize='30px' fontWeight='light' sx={{ textTransform: 'uppercase' }} gutterBottom>
        Compra com a La Cucaracha
      </Typography>
      <Typography fontSize='25px' fontWeight='light' pb={4}>
        A máxima qualidade
      </Typography>
      <Link href='/precario' passHref>
        <Button sx={{ fontSize: '20px', padding: '8px 30px' }} variant='contained' color='secondary'>
          Saber Mais
        </Button>
      </Link>
    </Container>
  );
}
