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
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [loading, setLoading] = React.useState('');
  const [error, setError] = React.useState('');
  const [description, setDescription] = React.useState('');
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
    if(name!=="" && description!=="" && price!==""  ){
    const obj ={
      name,
      price,
      description,
      adderID: user.id
    }
    console.log(obj)
    axios
    .post(`/products/add-product `,obj)
    .then((response) => {
      setLoading(false)
      window.location.href = "/products"
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
        Add Product
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Add Product  "}
        </DialogTitle>
        <DialogContent>
        <Box
        component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      >
      <div>
      <TextField
          required
          id="outlined-required"
          label="name"
          onChange={(e)=>setName(e.target.value)}
          value={name}
        />
      </div>
      <div>
      <TextField
          required
          id="outlined-required"
          label="Description" 
          onChange={(e)=>{setDescription(e.target.value)}}
          value={description}
        />
      </div>
      <div>
      <TextField
          required
          id="outlined-required"
          label="Unit Price"
          onChange={(e)=>{setPrice(e.target.value)}}
          value={price}
        />
      </div>
        </Box>
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
