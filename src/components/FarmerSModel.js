import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';
import Spinner from './Spinner';
import axios from '../axios'

export default function ResponsiveDialog() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [products, setProducts] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const user = useSelector(selectUser);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    setLoading(true)
    if(name!=="" && phone!=="" && location!=="" && products!=="" ){
    let prodList = products.split(',')
    const obj ={
      name,
      contact:phone,
      location,
      farmProducts:prodList,
      adderID: user.id
    }
    axios
    .post(`/farmer/add-farmer `,obj)
    .then((response) => {
      // console.log(response.data.data)
      setLoading(false)
      window.location.href = "/dashboard"
    }).catch((error) => {
      setError("something went wrong")
      setLoading(false)
    });
  }else{
    alert("All field must be filled")
  }
  }
  

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Farmer
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Add Farmer Here "}
        </DialogTitle>
        <DialogContent>
        <Box
        component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off">
      <div>
      <TextField
          required
          id="outlined-required"
          label="Name"
          name='name'
          value={name}
          onChange={(e)=>{setName(e.target.value)}}
          defaultValue="Name"
        />
      </div>
      <div>
      <TextField
          required
          id="outlined-required"
          label="Phone"
          name='phone'
          value={phone}
          onChange={(e)=>{setPhone(e.target.value)}}
          defaultValue="Phone Number"
        />
      </div>
      <div>
      <TextField
          required
          id="outlined-required"
          name='location'
          value={location}
          label="Location"
          onChange={(e)=>{setLocation(e.target.value)}}
          defaultValue="Farmer's Location"
        />
      </div>
      <div>
      <TextField
          required
          id="outlined-required"
          label="Products"
          name='products'
          value={products}
          onChange={(e)=>{setProducts(e.target.value)}}
          defaultValue="package Name"
        />
      </div>
        </Box>
        {error && <div>
        {error}
      </div>}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          {loading===true? <Spinner/> :
          <Button onClick={handleSubmit} autoFocus>
            Save
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
