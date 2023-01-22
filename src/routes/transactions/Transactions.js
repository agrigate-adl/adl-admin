import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from '../../axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Spinner from '../../components/Spinner'
const TableCellStyle = {
  cursor: 'pointer'
}


export default function BasicTable() {
  const [stati, setStati ] = React.useState(false)
  const [error, setError ] = React.useState(false)
  const [errorPack, setErrorPack ] = React.useState(false)
  const [openPackages, setOpenPackages] = React.useState(false);
  const [selectedID, setSelectedID] = React.useState('');
  const [packaged, setPackaged] = React.useState('');
  const [loader, setLoader] = React.useState(false)
  const [transactions, setTrasactions ] = React.useState([])
 React.useEffect(() => {
    fetchTransactions();
 }, []);
 const fetchTransactions = () =>{
   setStati(true);
   axios
   .get(`/transactions`)
   .then((response) => {
      if(response.data.data.length === 0){
        setError('No transactions fetched')
      }
      setTrasactions(response.data.data)
      setStati(false);
   }).catch((error) => {
     setError("something went wrong")
     setStati(false);
   });
 }
 const fetchPackage = (id) =>{
  console.log(id)
  setLoader(true);
  axios
  .get(`/packages/${id}`)
  .then((response) => {
     console.log(response)
     setPackaged(response.data.data)
     setLoader(false);
  }).catch((error) => {
    setErrorPack("something went wrong")
    setLoader(false);
  });
}
 const handlepackagesView = (id) =>{
  setSelectedID(id)
  fetchPackage(id)
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
            <TableCell >Payee Name</TableCell>
            <TableCell align="right">contact</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount &nbsp;</TableCell>
            <TableCell align="right"  style={{
              color:'blue'
            }} >Package ID &nbsp;</TableCell>
          </TableRow>
        </TableHead>
        {stati ? <div className="CenterSpinner"><Spinner /></div> :
        <TableBody>
          {transactions.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.payee.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.payee.contact}
              </TableCell>
              <TableCell align="right">{(new Date(row.createdAt)).toLocaleDateString("en-US")}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right" 
              
              onClick={()=>{handlepackagesView(row.package)}}
              style={{
              color:'blue'
            }}>{row.package}</TableCell>
            </TableRow>
            
          ))}
          {error !=="" &&
         <div className="CenterSpinner">{error}</div>}
        </TableBody>
        }
      </Table>
    </TableContainer>
    <Dialog
        open={openPackages}
        onClose={handlepackagesClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

       {loader? <div className="CenterSpinner"><Spinner /></div> :  <>
       <DialogTitle id="alert-dialog-title">
        {"Package"+ " : " + packaged.name}
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
            <TableCell >Summary</TableCell>
          </TableRow>
        </TableHead> 
        {(loader === false ) &&
        <TableBody>

              <TableRow
                className='packCellHover'
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell component='th' scope="row"  style={TableCellStyle}>
                {packaged.name}
              </TableCell>
                <TableCell component='th' scope="row">{packaged.totalAmount}</TableCell>
                <TableCell component='th' scope="row">{packaged.status}</TableCell>
                <TableCell component='th' scope="row">{packaged.balance}</TableCell>
                <TableCell component='th' scope="row">{packaged?.products?.map((prod)=>{
                 return <div>
                  {prod.count} of- {prod.name} @ {prod.price}
                  </div>
                })}</TableCell>
              </TableRow>
          
        </TableBody>
        }

      </Table>
    </TableContainer>
        </DialogContent> </>
        
        }
        {errorPack !=="" &&
         <div className="CenterSpinner">{errorPack}</div>}
      </Dialog>
    </div>
  );
}
