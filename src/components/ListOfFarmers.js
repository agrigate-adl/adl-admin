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
import SLUGS from'../resources/slugs'
import { useHistory } from 'react-router-dom';
import { convertSlugToUrl } from 'resources/utilities';
const TableCellStyle = {
    cursor: 'pointer'
 }

export default function AlertDialog() {
  const { push } = useHistory();
  const [open, setOpen] = React.useState(false);
  function createData(name, contact, location,Package) {
    return {name, contact, location,Package };
  }
  const rows = [
    createData('chambaga', '07000000', 'Mbale','good' ),
    createData('Akim', '00004005584','mukono', 'excellent' ),
    createData('Emma','3499995959','kampala','fantastic' ),
    createData('Bashir', '3456677778','masaka','bad' ),
    createData('Shaluwa', '344567788', 'Tororo','fair'),
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function onClick(slug, parameters = {}) {
    push(convertSlugToUrl(slug, parameters));
}

  return (
    <div>
      
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell >Contact</TableCell>
            <TableCell >Location</TableCell>
            <TableCell >Packages</TableCell>
           
          </TableRow>
        </TableHead>
       
       
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              
              <TableCell component='th' scope="row" onClick={() => onClick(SLUGS.farmer)} style={TableCellStyle}>
              {row.name}</TableCell>
                <TableCell component='th' scope="row">{row.contact}</TableCell>
                <TableCell component='th' scope="row">{row.location}</TableCell>
                <TableCell component='th' scope="row">{row.Package}</TableCell>

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
          {"Farmer's Details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  onClick={() => onClick(SLUGS.addpackage)}>Add package</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}
