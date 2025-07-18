import Layout, { PageCode } from '../src/components/Layout';
import { Typography, Stack, Box, Container } from '@mui/material';
import AboutPhoto from '../public/static/sections/AboutPhoto.svg';
import Image from 'next/image';
import surgeonTop from '../public/static/gallery/surgeonTop.jpg';
import surgeon from '../public/static/gallery/surgeon.jpg';
import Shaver from '../public/static/sections/Shaver.png';

export default function Sobre() {
  return (
    <Layout pageTitle='Sobre | Lacucaracha Barbershop' activePageCode={PageCode.ABOUT} disablePadding={true}>
      <Stack bgcolor='white' alignItems='center' padding='40px 0px'>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: { xs: 'center', md: 'left' },
            justifyContent: { xs: 'center', md: 'space-between' },
            flexDirection: { xs: 'column', md: 'row' },
            paddingTop: '30px',
            paddingBottom: '30px',
          }}
        >
          <Box sx={{ alignItems: 'center' }} flex='2' p='0px 0px 50px 0px'>
            <Image src={AboutPhoto} alt={'Foto Sobre'} width='300px' height='300px'></Image>
          </Box>
          <Box flex='2' textAlign='justify'>
            <Typography fontWeight='light'>Aqui na LA CUCARAHA seguimos a moda. </Typography>
            <Typography fontWeight='light'>
              A moda atual dita cada vez menos o corte rustico e cada vez mais um corte mais abrangente dando espaço
              para “fades” sempre com atenção ao detalhe e à simetria.
            </Typography>
            <Typography fontWeight='light'>
              Assim, o minimalismo é a nossa premissa base porque acreditamos que menos é mais.{' '}
            </Typography>
            <Typography fontWeight='light'>
              Juntando a este minimalismo a experiência e a capacidade de adaptação LA CUCARACHA torna-se assim numa
              barbearia inovadora, com a promessa da máxima qualidade e máxima satisfação do cliente.
            </Typography>
          </Box>
        </Container>
      </Stack>

      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: { xs: 'center', md: 'left' },
          justifyContent: { xs: 'center', md: 'space-between' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ paddingTop: '50px', paddingBottom: '50px' }}>
          <Typography fontSize='25px' fontWeight='light' sx={{ textTransform: 'uppercase' }} gutterBottom>
            A história da barbearia
          </Typography>
          <Typography fontSize='22px' fontWeight='light'>
            Porque tudo tem um começo
          </Typography>
        </Box>
        <Box display={{ xs: 'none', md: 'unsed' }} sx={{ opacity: '50%' }}>
          <Image objectPosition='120px 50px' height='400px' src={Shaver} objectFit='cover' />
        </Box>
      </Container>
      <Stack bgcolor='white' alignItems='center' justifyContent='center' paddingTop='50px' paddingBottom='20px'>
        <Container sx={{ flexDirection: { xs: 'column', md: 'row' }, display: 'flex' }}>
          <Box display={{ xs: 'unsed', md: 'none' }} paddingBottom='20px'>
            <Image src={surgeonTop} alt='História dos Barbeiros'></Image>
          </Box>
          <Box
            flex='1'
            textAlign='right'
            maxWidth={{ md: '250px', lg: '220px' }}
            display={{ xs: 'none', md: 'flex' }}
            paddingRight='50px'
          >
            <Image src={surgeon}></Image>
          </Box>
          <Box flex='1' textAlign='justify'>
            <Typography gutterBottom fontWeight='light'>
              Os primeiros salões de barbeiro surgiram há muito tempo, na Grécia Antiga.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              A mitologia grega contava que os deuses se preocupavam em manter sempre boa aparência e higiene e, por
              isso, o povo via , no ato de cuidar do seu aspeto, uma aproximação ao patamar de deus.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              O cabelo e a barba eram símbolos de coragem, força e inteligência e, por isso, se alguém pegasse nos seus
              cabelos ou na barba era considerado um atentado à honra. Dessa forma o barbeiro tornou-se uma figura de
              confiança, por ser quem mantinha a dignidade dos cidadãos gregos.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              A primeira organização de barbeiros surgiu em 1096 na França, quando o arcebispo da época proibiu o uso da
              barba.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              Dada a falta de procura e as características meticulosas dos barbeiros, surgiram então o
              barbeiro-cirurgião e o barbeiro-dentista, que se espalharam por toda Europa.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              Barbeiro-cirurgião passou a ser uma das profissões mais comuns na área médica, à falta de profissionais,
              eram eles que geralmente eram incumbidos do tratamento de soldados durante ou após batalhas.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              Com as novas descobertas da medicina, os cirurgiões começaram a aparecer e assim, os barbeiros foram
              proibidos de praticar medicina e odontologia.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              Juntado a isto, nos séculos 18 e 19 a moda era usar perucas e assim os barbeiros viram-se obrigados a
              largar o corte e a fabricar perucas para sobreviver.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              Somente por volta do ano de 1920 surgiram escolas de barbearia, e a profissão voltou a tona novamente.
            </Typography>
            <Typography gutterBottom fontWeight='light'>
              A barbearia se tornou mais que um sítio para cuidar da sua aparência e passou também a ser um ponto de
              encontro dos homens da época para discutir politica, negócios e deporto.{' '}
            </Typography>
          </Box>
        </Container>
      </Stack>
    </Layout>
  );
}
