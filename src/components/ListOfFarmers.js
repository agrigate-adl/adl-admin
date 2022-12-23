import React, { useState,useEffect } from 'react';
import axios from './../axios'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Spinner from './Spinner';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SLUGS from'../resources/slugs'
import { useHistory  } from 'react-router-dom';
import { convertSlugToUrl } from 'resources/utilities';
const TableCellStyle = {
    cursor: 'pointer'
 }

export default function AlertDialog() {
  
  const [farmers,setFarmers] = useState([])
  const [loader,setLoading] = useState(false)
  const [error,setError] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState({})

  let { push } = useHistory();
  const [openPackages, setOpenPackages] = React.useState(false);
 

  useEffect(() => {
    fetchFarmers();
 }, []);
 const fetchFarmers = () =>{
   setLoading(true);
   axios
   .get(`/farmer`)
   .then((response) => {
     // console.log(response)
     setFarmers(response.data.data)
     setLoading(false);
   }).catch((error) => {
     setError("something went wrong")
     setLoading(false);
   });
 }

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  function onFarmerClick(slug,farmer) {
    push(convertSlugToUrl(slug,{}),farmer);
  }
  function onClick(slug, parameters = {}) {
    push(convertSlugToUrl(slug, parameters));
  }
   const handlepackagesView = (farmer) =>{
    setSelectedFarmer(farmer)
    setOpenPackages(true);
  }
  const handlepackagesClose = () =>{
    setOpenPackages(false);
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
            <TableCell >Products</TableCell>
            <TableCell >No of Packages</TableCell>
          </TableRow>
        </TableHead>         
        { loader === true ?<div className="CenterSpinner"><Spinner /></div> :
        <TableBody>
          {farmers.map((row) => {
            return (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              
              <TableCell component='th' scope="row" onClick={() => onFarmerClick(SLUGS.farmer,row)} style={TableCellStyle}>
              {row.name}</TableCell>
                <TableCell component='th' scope="row">{row.contact}</TableCell>
                <TableCell component='th' scope="row">{row.location}</TableCell>
                <TableCell component='th' scope="row">{row.farmProducts.join(',')}</TableCell>
                <TableCell component='th' 
                className="hoverPackage"
                onClick={()=>{handlepackagesView(row)}}
                scope="row">{row.packages.length}</TableCell>

              </TableRow>
            );
          })}
        </TableBody>
        }

      </Table>
    </TableContainer>
    
      {/* <Dialog
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
      </Dialog> */}
      <Dialog
        open={openPackages}
        onClose={handlepackagesClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        {"Packages for"+ " " + selectedFarmer.name}
        </DialogTitle>
        <DialogContent>
        <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Package</TableCell>
            <TableCell >Total</TableCell>
            <TableCell >State</TableCell>
            <TableCell >Paid</TableCell>
          </TableRow>
        </TableHead> 
        {(loader === false &&  Object.keys(selectedFarmer).length>0) &&
        <TableBody>
          {selectedFarmer.packages.map((row,index) => {
            return (
              <TableRow
                key={index}
                className='packCellHover'
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell component='th' scope="row"  style={TableCellStyle}>
              package-{index+1}</TableCell>
                <TableCell component='th' scope="row">{row.totalDue}</TableCell>
                <TableCell component='th' scope="row">{row.status}</TableCell>
                <TableCell component='th' scope="row">{row.balance}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        }

      </Table>
    </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
