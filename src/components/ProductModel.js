import  React, { useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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

const TableCellStyle = {
    cursor: 'pointer'
 }

export default function AlertDialog() {
  const [error, setError] = React.useState(false);
  const [loader, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([])
  
  const [delOpen,setDelOpen] = useState(false)
  const [delError,setDelError] = useState('')
  const [selectedProd, setSelectedProd] = useState({})
  const [deleting,setDeleting] = useState(false)

  React.useEffect(() => {
    fetchProducts();
 }, []);

 const fetchProducts = () =>{
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
 const handleDelopen = (product) =>{
  setSelectedProd(product)
  setDelOpen(true);
}
const handleDelclose = () =>{
  setDelOpen(false);
}
 const DeleteProduct = () =>{
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
    <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Product No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell >Unit Price</TableCell>
            <TableCell >Description</TableCell>
            <TableCell >Action</TableCell>
          </TableRow>
        </TableHead>
       
        { loader === true ?<div className="CenterSpinner"><Spinner /></div> :
        <TableBody>
          {products.map((row) => {
            return (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope="row">{row.number}</TableCell>
              <TableCell component='th' scope="row"  style={TableCellStyle}>
              {row.name}</TableCell>
              <TableCell component='th' scope="row">{row.unitPrice}</TableCell>
                <TableCell component='th' scope="row">{row.description}</TableCell>
                <TableCell component='th' scope="row"><button 
                onClick={()=>{handleDelopen(row)}}
                className='DeleteButton'>
                  Delete
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        }
      </Table>
    </TableContainer>
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
          <Button  onClick={() => {handleDelclose()} }>Cancel</Button>
        
          <Button  onClick={() => {DeleteProduct()}}>
           {deleting?<Spinner/>: 'Delete'}
          </Button>
        </DialogActions>
        {delError && <div className="errorTxt" style={{
          color:'red'
        }} >
            {delError}
        </div>}
      </Dialog>
    </div>
  );
}
