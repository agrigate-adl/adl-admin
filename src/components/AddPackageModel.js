import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  TextField,
  Box,
  Checkbox,
  MenuItem,
  ListItemText,
  Select,
  OutlinedInput,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import axios from '../axios';
import Spinner from './Spinner';
import { selectUser } from 'features/userSlice';

export default function PackageSetModel({
  products,
  prodError,
  farmerId,
  selectedPackage,
  isEditMode = false,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const theme = useTheme();
  const user = useSelector(selectUser);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Derive selected product names using useMemo
  const selectedProductNames = useMemo(
    () => selectedProducts.map((p) => p.product || p.name),
    [selectedProducts]
  );

  useEffect(() => {
    if (isEditMode && selectedPackage) {
      setName(selectedPackage.name);
      setSelectedProducts(selectedPackage.products);
      setTotal(selectedPackage.totalAmount);
    }
  }, [isEditMode, selectedPackage]);

  const handleClickOpen = () => {
    if (prodError) {
      alert("Couldn't fetch products, please refresh.");
    } else if (!products.length) {
      alert('Please wait as products are loading.');
    } else {
      setOpen(true);
    }
  };

  const handleCountModification = (action, index) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((product, idx) =>
        idx === index
          ? {
              ...product,
              count:
                action === 'add'
                  ? product.count + 1
                  : Math.max(1, product.count - 1), 
            }
          : product
      )
    );
  };

  const handleChange = (event) => {
    const valueArray =
      typeof event.target.value === 'string'
        ? event.target.value.split(',')
        : event.target.value;

    const updatedProducts = valueArray.map((productName) => ({
      product: productName,
      count: 1,
    }));

    setSelectedProducts(updatedProducts);
  };


  useEffect(() => {
    const totalAmount = selectedProducts.reduce((sum, selected) => {
      const product = products.find(
        (p) => p.name === selected.product || p.name === selected.name
      );
      return product
        ? sum + parseFloat(product.unitPrice) * parseFloat(selected.count)
        : sum;
    }, 0);

    setTotal(totalAmount);
  }, [selectedProducts, products]);

  const handleClose = () => setOpen(false);

  const savePackage = async () => {
    setLoading(true);
    try {
      const productList = selectedProducts.map((selected) => {
        const product = products.find(
          (p) => p.name === selected.product || p.name === selected.name
        );
        return {
          productID: product?._id,
          name: product.name,
          price: product.unitPrice,
          count: selected.count,
        };
      });

      const packageData = {
        name,
        adderID: user.id,
        products: productList,
        totalAmount: total,
      };
      if(!isEditMode){
        packageData.owner = farmerId
      }

      const request = isEditMode
        ? axios.patch(`/packages/${selectedPackage._id}`, packageData)
        : axios.post('/packages/add-package', packageData);

      await request;
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {isEditMode ? 'Edit Package' : 'Add Package'}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{ height: '80vh', width: isSmallScreen ? '25rem' : 'auto' }}
      >
        <DialogTitle id="responsive-dialog-title">
          {isEditMode ? 'Edit Package' : 'Add Package'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id="outlined-required"
              onChange={(e) => setName(e.target.value)}
              value={name}
              label="Name"
            />
            <div className="SelectionHolder">
              <label>Select Products</label>
              <Select
                multiple
                value={selectedProductNames}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {products.map((prod) => (
                  <MenuItem key={prod._id} value={prod.name}>
                    <Checkbox checked={selectedProductNames.includes(prod.name)} />
                    <ListItemText primary={`${prod.name} @ ${prod.unitPrice}`} />
                  </MenuItem>
                ))}
              </Select>
              <div style={{ fontSize: '1rem' }}>Total = UGX {total}</div>
              {selectedProducts.map((prod, index) => (
                <div key={index} className="productsRender">
                  <div>{prod.product || prod.name}</div>
                  <div className="numberSelector">
                    <ArrowBackIos
                      className="HoverArrow"
                      onClick={() => handleCountModification('sub', index)}
                      sx={{ fontSize: '1rem' }}
                    />
                    <div className="selectedNumbers">{prod.count}</div>
                    <ArrowForwardIos
                      className="HoverArrow"
                      onClick={() => handleCountModification('add', index)}
                      sx={{ fontSize: '1rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {error && <div className="errorMsg">{error}</div>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          {loading ? <Spinner /> : <Button onClick={savePackage}>{isEditMode ? 'Update' : 'Save'}</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
