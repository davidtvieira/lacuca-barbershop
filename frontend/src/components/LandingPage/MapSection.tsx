import { Typography, Box, Container, Paper } from '@mui/material';

export default function MapSection() {
  return (
    <Box padding='40px 0px' bgcolor='secondary.main'>
      <Container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
        <Typography variant='h5' fontWeight='light' sx={{ textTransform: 'uppercase' }}>
          Localização
        </Typography>
        <Paper elevation={6} sx={{ width: '100%', height: '450px', m: '50px 0px' }}>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.4440197628724!2d-8.599079999999999!3d41.1684817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd24645c9a28df23%3A0xf1cc906ca2ad5022!2sR.%20Hern%C3%A2ni%20Torres%20183%2C%204200-320%20Porto%2C%20Portugal!5e0!3m2!1spt!2spt!4v1635647556908!5m2!1spt!2spt'
            loading='lazy'
            style={{ border: 0 }}
            width='100%'
            height='100%'
          ></iframe>
        </Paper>
      </Container>
    </Box>
  );
}
