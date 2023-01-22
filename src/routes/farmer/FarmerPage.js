import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import axios from '../../axios'
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddPackageModel from '../../components/AddPackageModel'
import { useLocation  } from 'react-router-dom';
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


export default function ControlledAccordions() {
const [expanded, setExpanded] = React.useState(false);
const [products, setProducts] = React.useState([]);
const [prodError, setProdError] = React.useState('')

const location = useLocation();
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 React.useEffect(() => {
    getProducts();
 }, []);

const getProducts = () =>{
  axios
  .get(`/products`)
  .then((response) => {
    //back process
    setProducts(response.data.data)
  }).catch((error) => {
    setProdError("something went wrong")
  });
}
  
  
  return (
    <div>
      <div  style={{
        marginBottom: '1rem'
      }} >
      <AddPackageModel products={products} prodError={prodError} farmerId={location.state._id}/>
      </div>
      <div className='FarmerDataRow'>
        <div className='FarmerHeaderData'>
         Name
        </div>
        <div className='FarmerSectionData'>
          {location.state.name}
        </div>
      </div>
      <div className='FarmerDataRow'>
        <div className='FarmerHeaderData'>
         Contact
        </div>
        <div className='FarmerSectionData'>
          {location.state.contact}
        </div>
      </div>
      <div className='FarmerDataRow'>
        <div className='FarmerHeaderData'>
         Location
        </div>
        <div className='FarmerSectionData'>
          {location.state.location}
        </div>
      </div>
      <div className='FarmerDataRow'>
        <div className='FarmerHeaderData'>
         Farm produce
        </div>
        <div className='FarmerSectionData'>
          {location.state.farmProducts.join(',')}
        </div>
      </div>
      <div className='FarmerDataRow'>
        <div className='FarmerHeaderData'>
         Added on 
        </div>
        <div className='FarmerSectionData'>
          {(new Date(location.state.createdAt)).toLocaleDateString("en-US")}
        </div>
      </div>
      
      <Accordion className='AccordianWid' expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '65%', flexShrink: 0 }}>Packages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
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
        {(Object.keys(location.state.packages).length>0) &&
        <TableBody>
          {location.state.packages.map((row,index) => {
            return (
              <TableRow
                key={index}
                className='packCellHover'
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell component='th' scope="row"  style={TableCellStyle}>{row.name}
              </TableCell>
                <TableCell component='th' scope="row">{row.totalDue}</TableCell>
                <TableCell component='th' scope="row">{row.status}</TableCell>
                <TableCell component='th' scope="row">{row.balance}</TableCell>
                <TableCell component='th' scope="row">{row.products.map((prod)=>{
                 return <div>
                  {prod}
                  </div>
                })}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        }

      </Table>
    </TableContainer>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
