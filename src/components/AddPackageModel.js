import React, { useEffect } from 'react';
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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { OutlinedInput } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';
import Spinner from './Spinner';
import { fontSize } from '@mui/system';

export default function ResponsiveDialog({ products, prodError, farmerId }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const theme = useTheme();
  const user = useSelector(selectUser);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedProducts, setselectedProducts] = React.useState([]);
  const [selectedProductsNames, setselectedProductNames] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const handleClickOpen = () => {
    if (prodError !== '') {
      alert("couldn't fetch products, please refreash")
    } else if (products.length < 1) {
      alert("please wait as products are loading")
    } else {
      setOpen(true);
    }
  };
  const handleCountModification = (action, index) => {

    let modifiableProducts = [...selectedProducts]
    if (action === 'add') {
      modifiableProducts[index].count = modifiableProducts[index].count + 1
    }
    if (action === 'sub' && (modifiableProducts[index].count - 1) > 0) {
      modifiableProducts[index].count = modifiableProducts[index].count - 1
    }

    setselectedProducts(modifiableProducts)
  }
  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    // create objects
    let Value = value
    if (typeof value === 'string') {
      // On autofill we get a the stringified value.
      Value = value.split(",")
    }
    let productsObjArray = []
    Value.forEach((element, index) => {
      productsObjArray.push({ product: element, count: 1 })

    });
    setselectedProducts(productsObjArray);
    setselectedProductNames(Value)
  };
  React.useEffect(() => {
    let total = 0
    selectedProducts.forEach((obj) => {
      products.forEach(element => {
        if (element.name === obj.product) {
          total += (element.unitPrice * obj.count)
        }
      });
    })
    setTotal(total)
  }, [selectedProducts, total]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleNameChange = (e) => {
    const {
      target: { value }
    } = e;
    setName(value)
  }
  const addPackages = () => {
    setLoading(true)
    // let productsList = products.filter(prod => {
    //   if(selectedProductsNames.includes(prod.name)){
    //     return {
    //       productID:prod._id,
    //       name:prod.name,
    //       price:prod.unitPrice
    //     }
    //   }
    // });
    let productList = []
    selectedProducts.forEach((obj, index) => {
      for (var i = 0; i < products.length; i++) {
        if (products[i].name === obj.product) {
          productList.push(
            {
              productID: products[i]._id,
              name: products[i].name,
              price: products[i].unitPrice,
              count: obj.count
            }
          )
        }
      }
    })
    console.log(productList)
    let packageData = {
      name,
      owner: farmerId,
      adderID: user.id,
      products: productList,
      totalAmount: total
    }
    axios
      .post(`/packages/add-package`, packageData)
      .then((response) => {
        // console.log(response.data.data)
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
                onChange={(e) => { handleNameChange(e) }}
                value={name}
                label="Name"
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
                value={selectedProductsNames}
                name="first"
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(",")}>
                {products.map((prod) => (
                  <MenuItem className='menuItem' key={prod._id} value={prod.name}>
                    <Checkbox checked={selectedProductsNames.indexOf(prod.name) > -1} />
                    <ListItemText primary={`${prod.name} @ ${prod.unitPrice}`} />
                  </MenuItem>
                ))}
              </Select>
              <div style={{ fontSize: '1rem' }}>Total = UGX {total}</div>
              <div>
                {selectedProducts.map((prod, index) => (
                  <div key={index} className='productsRender'>
                    <div>{prod.product}</div>
                    <div className='numberSelector'>
                      <ArrowBackIosIcon className='HoverArror' onClick={() => { handleCountModification('sub', index) }}
                        sx={{ fontSize: '1rem' }} fontSize='inherit' />
                      <div className='slectedNumbers'>
                        {prod.count}
                      </div>
                      <ArrowForwardIosIcon className='HoverArror' onClick={() => { handleCountModification('add', index) }}
                        sx={{ fontSize: '1rem' }} fontSize='inherit' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {error && <div className='errorMsg'>
              {error}
            </div>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          {loading === true ? <Spinner /> :
            <Button onClick={addPackages} autoFocus>
              Save
            </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
