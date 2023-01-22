import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Spinner from '../../components/Spinner';
import axios from '../../axios';


export default function BasicTable() {
  const [error, setError] = React.useState(false);
  const [loader, setLoading] = React.useState(false);
  const [packages, setPackages] = React.useState([]);
  React.useEffect(() => {
    fetchPackages();
  }, []);
  const fetchPackages = () =>{
   setLoading(true);
   axios
   .get(`/packages`)
   .then((response) => {
     setPackages(response.data.data)
     setLoading(false);
   }).catch((error) => {
     setError("something went wrong")
     setLoading(false);
   });
  }
  

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Date</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Amount paid</TableCell>
            <TableCell >Total Amount</TableCell>
            <TableCell >Summary</TableCell>
          </TableRow>
        </TableHead>
        { loader === true ?<div className="CenterSpinner"><Spinner /></div> :
        <TableBody>
          {packages.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell component='th' scope="row">{(new Date(row.createdAt)).toLocaleDateString("en-US")}</TableCell>
              <TableCell component='th' scope="row">{ row.status}</TableCell>
              <TableCell component='th' scope="row">{ row.balance}</TableCell>
              <TableCell component='th' scope="row">{ row.totalAmount}</TableCell> 
              <TableCell component='th' scope="row">{row.products.map((prod)=>{
                 return <div>
                  {prod.count} of- {prod.name} @ {prod.price}
                  </div>
                })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        }
      </Table>
    </TableContainer>
  );
}
