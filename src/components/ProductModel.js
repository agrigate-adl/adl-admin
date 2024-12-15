import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Spinner from './Spinner';
import axios from '../axios'
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { formatNumber } from 'config';


const TableCellStyle = {
  cursor: 'pointer'
}

export default function AlertDialog() {
  const [error, setError] = React.useState(false);
  const [loader, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [delOpen, setDelOpen] = useState(false);
  const [delError, setDelError] = useState('');
  const [selectedProd, setSelectedProd] = useState({});
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(`/products`)
      .then((response) => {
        setProducts(response.data.data)
        setLoading(false);
      }).catch((error) => {
        setError("something went wrong")
        setLoading(false);
      });
  }
  const handleDelopen = (product) => {
    setSelectedProd(product)
    setDelOpen(true);
  }
  const handleDelclose = () => {
    setDelOpen(false);
  }
  const DeleteProduct = () => {
    setDeleting(true);
    axios
      .delete(`/products/${selectedProd._id}`)
      .then((response) => {
        // console.log(response)
        setDeleting(false);
        handleDelclose()
        fetchProducts()
      }).catch((error) => {
        setDelError("failed to delete farmer")
        setDeleting(false);
      });
  }

  return (
    <div style={{
      width: "100%",
      height: "80vh",
      marginTop: 15,
      flex: 1
    }}>

      {loader === true ? <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }} className=""><Spinner size='big' /></div> :
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
            >
              <Table aria-label="responsive table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((row) => (
                    <TableRow
                      key={row.number}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.number}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{formatNumber(row.unitPrice)}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelopen(row)}
                          className="DeleteButton"
                          style={{
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      }

      <Dialog
        open={delOpen}
        onClose={handleDelclose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm this action?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete: {selectedProd.name}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => { handleDelclose() }}>Cancel</Button>

          <Button onClick={() => { DeleteProduct() }}>
            {deleting ? <Spinner /> : 'Delete'}
          </Button>
        </DialogActions>
        {delError && <div className="errorTxt" style={{
          color: 'red'
        }} >
          {delError}
        </div>}
      </Dialog>
    </div>
  );
}
