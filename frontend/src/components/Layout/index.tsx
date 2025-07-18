import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemText,
  ListItemButton,
  Stack,
  Divider,
  Button,
  Typography,
  Alert,
  Container,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Badge,
} from '@mui/material';
import {
  BookOnline,
  EventAvailable,
  Instagram,
  Logout,
  Menu as MenuIcon,
  PhoneInTalk,
  Room,
} from '@mui/icons-material';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import LogoImage from '../../../public/static/Logo.png';
import LogoBlackImage from '../../../public/static/LogoBlack.png';
import { signOut, useSession } from 'next-auth/react';
import { styled } from '@mui/system';
import { barberProfiles } from '../../samples/barberProfiles';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activePageCode?: PageCode;
  disablePadding?: boolean;
  disableFooter?: boolean;
}

interface Page {
  text: string;
  code?: PageCode;
  href: string;
  hideFromTopBar?: boolean;
}

export enum PageCode {
  'HOME',
  'PRICING',
  'SCHEDULE',
  'ABOUT',
}

const navPages: Page[] = [
  {
    text: 'Início',
    code: PageCode.HOME,
    href: '/',
  },
  {
    text: 'Preçário',
    code: PageCode.PRICING,
    href: '/precario',
  },
  {
    text: 'Sobre',
    code: PageCode.ABOUT,
    href: '/sobre',
  },
  {
    text: 'Política de Privacidade',
    href: '/politica-de-privacidade',
    hideFromTopBar: true,
  },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function Layout({
  children,
  pageTitle,
  activePageCode,
  disablePadding = false,
  disableFooter = false,
}: LayoutProps) {
  const [open, setOpen] = useState(false);
  const [openDevAlert, setDevAlertOpen] = useState(true);
  const { data: session } = useSession();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpen(open);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openAvatarMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      }}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AppBar elevation={1} position='sticky' sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}>
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <IconButton
                color='secondary'
                aria-label='open drawer'
                onClick={toggleDrawer(!open)}
                edge='start'
                sx={{
                  display: {
                    md: 'none',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box display={{ xs: 'none', sm: 'flex' }} justifyContent='center'>
                <Image placeholder='blur' priority src={LogoImage} alt='Logo' width={130} height={40} layout='fixed' />
              </Box>
            </Box>
            <Stack
              direction='row'
              spacing={1}
              justifyContent='center'
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
              }}
            >
              {navPages.map((page, index) => {
                if (!page.hideFromTopBar) {
                  const isSelected = page.code === activePageCode;
                  return (
                    <Link href={page.href} key={index} passHref>
                      <Stack>
                        <Button color='secondary' variant='text' size='small'>
                          {page.text}
                        </Button>
                        {isSelected && <Divider color='white' />}
                      </Stack>
                    </Link>
                  );
                }
              })}
            </Stack>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Link href='/agendar' passHref>
                <Button
                  color='secondary'
                  variant='contained'
                  size='small'
                  sx={{ marginLeft: '10px', maxHeight: '30px' }}
                >
                  Agendar
                </Button>
              </Link>
              {session && (
                <>
                  <StyledBadge
                    overlap='circular'
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant='dot'
                    onClick={handleClick}
                    sx={{ cursor: 'pointer' }}
                  >
                    {session.user.extraInfo.isBarber ? (
                      <Avatar src={barberProfiles.find((b) => b.uid == session.user.uid)?.profilePhoto} />
                    ) : (
                      <Avatar />
                    )}
                  </StyledBadge>
                  <Menu
                    anchorEl={anchorEl}
                    open={openAvatarMenu}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 30,
                          height: 30,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Link href={session.user.extraInfo.isBarber ? '/barbeiro/agendamentos' : '/agendamentos'} passHref>
                      <MenuItem>
                        <ListItemIcon>
                          <BookOnline fontSize='small' />
                        </ListItemIcon>
                        Agendamentos
                      </MenuItem>
                    </Link>
                    <Divider />
                    <MenuItem onClick={() => signOut({ redirect: false })}>
                      <ListItemIcon>
                        <Logout fontSize='small' />
                      </ListItemIcon>
                      Sair
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant='temporary'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'unset',
          },
        }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Toolbar sx={{ justifyContent: 'center', backgroundColor: 'primary.main' }}>
          <Image placeholder='blur' priority src={LogoImage} alt='Logo' width={130} height={40} layout='fixed' />
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: 'auto', height: '100%', p: 1 }}>
          <List>
            {navPages.map((page, index) => {
              if (!page.hideFromTopBar) {
                const isSelected = page.code === activePageCode;
                return (
                  <Link href={page.href} key={index} passHref>
                    <ListItemButton selected={isSelected}>
                      <ListItemText primary={page.text} />
                    </ListItemButton>
                  </Link>
                );
              }
            })}
          </List>
        </Box>
      </Drawer>
      {process.env.NODE_ENV == 'development' && (
        <Box sx={{ width: '100%' }}>
          <Collapse in={openDevAlert} sx={{ bgcolor: 'rgb(255, 244 ,229)' }}>
            <Container>
              <Alert severity='warning' sx={{ padding: '6px 0px' }} onClose={() => setDevAlertOpen(false)}>
                Esta versão do website encontra-se em desenvolvimento e pode sofrer alterações.
              </Alert>
            </Container>
          </Collapse>
        </Box>
      )}
      <Box
        component='main'
        sx={{
          bgcolor: '#f3f3f3',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          ...(disablePadding ? { p: 0 } : { p: 3 }),
        }}
      >
        {children}
        {!disableFooter && (
          <Box bgcolor='#f3f3f3'>
            <Container sx={{ p: 3 }}>
              <Stack alignItems={{ xs: 'flex-start', sm: 'center' }} direction={{ xs: 'column', sm: 'row' }}>
                <Stack spacing={1}>
                  <Image
                    placeholder='blur'
                    priority
                    src={LogoBlackImage}
                    alt='Logo'
                    width={150}
                    height={38}
                    layout='fixed'
                  />
                  <Stack direction='row' alignItems='center'>
                    <Room fontSize='small' />
                    <Typography fontSize='10px' fontWeight='light' ml={1}>
                      Rua Hernâni Torres 183 Paranhos, Porto
                    </Typography>
                  </Stack>
                  <Stack direction='row' alignItems='center'>
                    <EventAvailable fontSize='small' />
                    <Typography fontSize='10px' fontWeight='light' ml={1}>
                      Segunda - Sábado: 9h - 19:30
                    </Typography>
                  </Stack>
                  <Stack direction='row' alignItems='center'>
                    <PhoneInTalk fontSize='small' />
                    <Typography fontSize='10px' fontWeight='light' ml={1}>
                      919 054 320
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      '& a': {
                        color: 'rgb(0 0 0 / 87%)',
                        textDecoration: 'none',
                      },
                    }}
                  >
                    <a target='_blank' href={`https://instagram.com/la_cucarachabarber`} rel='noopener noreferrer'>
                      <Stack direction='row' alignItems='center'>
                        <Instagram fontSize='small' />
                        <Typography fontSize='10px' fontWeight='light' ml={1}>
                          @la_cucarachabarber
                        </Typography>
                      </Stack>
                    </a>
                  </Box>
                </Stack>
                <Stack
                  flexGrow={1}
                  justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
                  direction={{ xs: 'column', sm: 'row' }}
                  m={{ xs: '30px 0px 0px 0px', sm: '0px 0px 0px 20px' }}
                  sx={{
                    '& a': {
                      color: 'rgb(0 0 0 / 87%)',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {navPages.map((page, index) => {
                    return (
                      <Link key={`footer_nav_${index}`} href={page.href}>
                        <a>{page.text}</a>
                      </Link>
                    );
                  })}
                </Stack>
              </Stack>
            </Container>
          </Box>
        )}
      </Box>
    </Box>
  );
}
