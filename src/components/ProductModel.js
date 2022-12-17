import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TableCellStyle = {
    cursor: 'pointer'
 }

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  function createData(name, description,) {
    return {name, description, };
  }
  const rows = [
    createData('Maize', 'its good one', ),
    createData('Rice', 'awesome Product', ),
    createData('Cassava','cool product', ),
    createData('Banana', 'good product', ),
    createData('G.nut', 'fine good', ),
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Description</TableCell>
           
          </TableRow>
        </TableHead>
       
       
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              
              <TableCell component='th' scope="row" onClick={handleClickOpen}  style={TableCellStyle}>
              {row.name}</TableCell>
                <TableCell component='th' scope="row">{row.description}</TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Product Details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}
