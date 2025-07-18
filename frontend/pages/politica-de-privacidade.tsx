import Layout from '../src/components/Layout';
import { Stack, Typography, Box, Container } from '@mui/material';

export default function Privacidade() {
  return (
    <Layout pageTitle='Política de Privacidade | Lacucaracha Barbershop' disablePadding={true}>
      <Container>
        <Stack justifyContent='center' alignItems='center'>
          <Box justifyContent='center ' p={{ xs: '40px 0px 40px 0px', sm: '40px 0px 40px 0px' }}>
            <Typography fontFamily='25px' paddingBottom='5px' fontWeight='bold'>
              Política de Privacidade
            </Typography>
            <Typography paddingBottom='5px'>
              Que tipo de informação recolhemos? Nós recebemos, recolhemos e arquivamos as informações que são
              adicionadas no nosso site ou nos são fornecidas de qualquer outra forma. Além disso, nós recolhemos o
              endereço IP utilizado para conectar o seu computador à internet, dados de login, endereço de email, senha,
              informações do computador e internet e histórico de compra. Nós poderemos utilizar ferramentas para medir
              e recolher informações de navegação, incluindo o tempo de resposta das páginas, tempo total da visita em
              determinadas páginas, informações de interação com página e os métodos utilizados para deixar a página.
              Nós também recolhemos informações de identificação pessoal (incluindo nome, email, senha, meios de
              comunicação); detalhes de pagamento (incluindo informações de cartão de crédito), comentários, feedback,
              recomendações e perfil pessoal.
            </Typography>
            <Typography paddingBottom='5px'>
              Como recolhemos informações? Quando você realiza uma transação no nosso site, como parte do procedimento,
              nós recolhemos as informações epessoas fornecidas como o seu nome, endereço e endereço de email. As suas
              informações pessoais serão utilizadas para as ações específicas citadas abaixo apenas.
            </Typography>
            <Typography paddingBottom='5px'>
              Por que recolhemos essas informações pessoais? Para prestar aos nossos usuários assistência e suporte
              técnico contínuos ao cliente, para prestar e operar os serviços, para fornecer aos nossos usuários
              assistência ao cliente contínua e suporte técnico, para poder entrar em contato com nossos visitantes e
              usuários com avisos gerais ou personalizados relacionados a serviços e mensagens promocionais, para criar
              dados estatísticos agregados e outras informações não pessoais agregadas e/ou inferidas, que podem ser
              usadas por nós ou por nossos parceiros comerciais para prestar e melhorar nossos respectivos serviços e
              para cumprir quaisquer leis e regulamentos aplicáveis.
            </Typography>
            <Typography paddingBottom='5px'>
              Como armazenamos, utilizamos e compartilhamos as informações pessoais dos visitantes do nosso site? O
              nosso negócio está hospedado numa plataforma online que nos permite vender produtos e serviços para nossos
              clientes. As suas informações podem ser armazenadas no nosso banco de dados, seguras por firewall.
            </Typography>
            <Typography paddingBottom='5px'>
              Como comunicamos com os visitantes do nosso site? Nós poderemos entrar em contato para notificá-lo a
              respeito de sua conta, para ajudá-lo a resolver alguma questão relacionada à sua conta, para solucionar
              uma disputa de pagamento, para recolher taxas ou dívidas, para pequisas ou questionários, para novidades
              sobre nossa empresa ou para qualquer outro motivo que seja necessário revisar o nosso contrato, de acordo
              com as leis locais. Para isso, poderemos entrar em contato via email, telefone, mensagens de texto e
              correio
            </Typography>
            <Typography paddingBottom='30px'>
              Como os visitantes do nosso site podem retirar o seu consentimento? Caso não pretenda que recolhamos as
              suas informações pessoais, por favor entre em contato através do nosso email
              ajuda@lacucarachabarbershop.com ou envie-nos uma mensagem para o contacto 919054320.
            </Typography>
            <Typography paddingBottom='5px' fontFamily='25px' fontWeight='bold'>
              Atualizações da política de privacidade
            </Typography>
            <Typography paddingBottom='30px'>
              Nós temos o direito de modificar essa política de privacidade a qualquer momento, portanto consulte
              regularmente. As alterações e esclarecimentos serão imediatamente colocadas em práticas após a alteração
              em nosso site. Caso realizarmos mudanças referentes aos materiais dessa política, será notificado para que
              esteja ciente das informações que recolhemos e como as utilizamos.
            </Typography>
            <Typography paddingBottom='5px' fontFamily='25px' fontWeight='bold'>
              Perguntas e informações acerca do seu contacto
            </Typography>
            <Typography paddingBottom='5px'>
              Se quiser acessar, corrigir ou excluir qualquer informação que tenhamos coletado, fique à vontade para
              contatar-nos por email ajuda@lacucarachabarbershop.com ou contate-nos através do contacto 919054320.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
}
