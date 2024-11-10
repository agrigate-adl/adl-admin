import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Spinner from '../../components/Spinner'
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { login } from 'features/userSlice';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {

    const [ email ,setEmail] = React.useState("")
    const [ password ,setPassword] = React.useState("")
    const [ signingIN ,setsigningIN] = React.useState(false)
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
    setsigningIN(true)
    e.preventDefault();
    if(email || password){
        axios({
          
            url: API_BASE_URL+"/admin/login",
            method: "POST",
            data: {
              email:email,
              password:password
            }
          })
            .then((res) => {     
                const user= {
                   id: res.data.user._id,
                   email:res.data.user.email,
                   name:res.data.user.name,
                   role:res.data.user.role,
                   contact:res.data.user.contact,
                   token:res.data.token
                }
                localStorage.setItem("token", user.token);
                
                setsigningIN(false)
                return  dispatch(
                     login(user)
                  )
            })
            .catch((err) => { 
                alert(err.data.messege)
                setsigningIN(false)
            });
      
    }else{
      alert("email and password are both required")
      return
    }

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={(e)=> handleSubmit(e)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={email}
              label="Email Address"
              name='email'
              autoComplete="email"
              autoFocus
              onChange={(e)=> setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={password }
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={(e)=>setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {signingIN? <Spinner/> : "Sign In"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}