import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Spinner from './Spinner';
import axios from '../axios'

const TableCellStyle = {
    cursor: 'pointer'
 }

export default function AlertDialog() {
  const [error, setError] = React.useState(false);
  const [loader, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([])

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


  return (
    <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Unit Price</TableCell>
            <TableCell >Description</TableCell>
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
              
              <TableCell component='th' scope="row"  style={TableCellStyle}>
              {row.name}</TableCell>
              <TableCell component='th' scope="row">{row.unitPrice}</TableCell>
                <TableCell component='th' scope="row">{row.description}</TableCell>

              </TableRow>
            );
          })}
        </TableBody>
        }
      </Table>
    </TableContainer>
    </div>
  );
}
