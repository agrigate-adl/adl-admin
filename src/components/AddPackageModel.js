import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import axios from '../axios'
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { OutlinedInput } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';
import Spinner from './Spinner';

export default function ResponsiveDialog({products, prodError, farmerId}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const theme = useTheme();
  const user = useSelector(selectUser);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [packageName, setpackageName] = React.useState([]);
  const handleClickOpen = () => {
    if(prodError!==''){
      alert("couldn't fetch products, please refreash") 
    }else if(products.length < 1){
      alert("please wait as products are loading")
    }else{
      setOpen(true);
    }
  };
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setpackageName(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
//   useEffect(() => {
//  }, [products,prodError]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleNameChange=(e)=>{
    const {
      target: { value }
    } = e;
    setName(value)
  }
  const addPackages = () =>{
    setLoading(true)
    let total = 0
    let productsList = products.filter(prod => {
      if(packageName.includes(prod.name)){
        total += Number(prod.unitPrice)
        return {
          productID:prod._id,
          name:prod.name,
          price:prod.unitPrice
        }
      }
    });
    let packageData = {
      name,
      owner: farmerId,
      adderID: user.id,
      products: productsList,
      totalAmount: total
    }
    axios
    .post(`/packages/add-package`,packageData)
    .then((response) => {
      console.log(response.data.data)
      setLoading(false)
      window.location.href = "/dashboard"
    }).catch((error) => {
      setError("something went wrong")
      setLoading(false)
    });
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Package
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Add Package   "}
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
          onChange={(e)=>{handleNameChange(e)}}
          value={name}
          label="Name"
          defaultValue="Name"
        />
      </div>
      <div className='SelectionHolder'>
      <label>
          Select Products
      </label>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          multiple
          label="Products"
          className='SelectMultipleField'
          value={packageName}
          name="first"
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected
          // .map(obj=>{
          //   products[(packageName.indexOf(obj))].name
          // })
          .join(",")}>
          {products.map((prod) => (
            <MenuItem className='menuItem' key={prod._id} value={prod.name}>
              <Checkbox checked={packageName.indexOf(prod.name) > -1} />
              <ListItemText primary={prod.name} />
            </MenuItem>
          ))}
        </Select>
      </div>
      {error && <div>
        {error}
      </div>}
        </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          {loading===true? <Spinner/> :
          <Button onClick={addPackages} autoFocus>
            Save
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
