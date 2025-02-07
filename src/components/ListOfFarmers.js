import React, { useState, useEffect } from 'react';
import axios from './../axios'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Spinner from './Spinner';
import { IconSearch } from 'assets/icons';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DialogActions from '@mui/material/DialogActions';
import SLUGS from '../resources/slugs'
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import { convertSlugToUrl } from 'resources/utilities';
import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';
const TableCellStyle = {
  cursor: 'pointer'
}

export default function AlertDialog() {

  const [farmers, setFarmers] = useState([])
  const [loader, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [searchWord, setSearchWord] = useState('')
  const [delOpen, setDelOpen] = useState(false)
  const [delError, setDelError] = useState('')
  const user = useSelector(selectUser);
  const [selectedFarmer, setSelectedFarmer] = useState({})

  let { push } = useHistory();
  const [openPackages, setOpenPackages] = React.useState(false);


  useEffect(() => {
    fetchFarmers();
  }, []);


  const fetchFarmers = () => {
    var endpoint = `/farmer/agent/${user.id}`
    if(user.role === 'admin'){
      endpoint = `/farmer`
    }
    console.log(endpoint)

    setLoading(true);
    axios
      .get(endpoint)
      .then((response) => {
        // console.log(response)
        setFarmers(response.data.data)
        setLoading(false);
      }).catch((error) => {
        setError(user.role ? "No farmers added yet" : "something went wrong")
        setLoading(false);
      });
  }

  const DeleteFarmer = () => {
    setDeleting(true);
    axios
      .delete(`/farmer/${selectedFarmer._id}`)
      .then((response) => {
        // console.log(response)
        setDeleting(false);
        handleDelclose()
        fetchFarmers()
      }).catch((error) => {
        setDelError("failed to delete farmer")
        setDeleting(false);
      });
  }

  const getSearchFarmers = () => {
    //   if(searchWord !== ""){
    //   setLoading(true);
    //   axios
    //   .post(`/farmer/search-farmer`,{word: searchWord})
    //   .then((response) => {
    //     if (response.data.data !== undefined){
    //     setFarmers(response.data.data)
    //     } else {
    //       setError("No results for this search")
    //     }
    //     setLoading(false);
    //   }).catch((error) => {
    //     setError("something went wrong")
    //     setLoading(false);
    //   });
    // }
    if (searchWord !== '' && farmers.length > 0) {
      const filteredFarmers = farmers.filter((farmer) => {
        // Perform case-insensitive search on the farmer's name or contact
        const farmerName = farmer.name.toLowerCase();
        const farmerContact = farmer.contact.toLowerCase();
        const searchTerm = searchWord.toLowerCase();
        return farmerName.includes(searchTerm) || farmerContact.includes(searchTerm);
      });

      if (filteredFarmers.length > 0) {
        setFarmers(filteredFarmers);
        setError('');
      } else {
        setError('No results for this search');
      }
    } else {
      setFarmers(farmers);
      setError('');
    }

  }


  function onFarmerClick(slug, farmer) {
    push(convertSlugToUrl(slug, {}), farmer);
  }
  function onClick(slug, parameters = {}) {
    push(convertSlugToUrl(slug, parameters));
  }
  const handlepackagesView = (farmer) => {
    setSelectedFarmer(farmer)
    setOpenPackages(true);
  }
  const handlepackagesClose = () => {
    setOpenPackages(false);
  }
  const handleDelopen = (farmer) => {
    setSelectedFarmer(farmer)
    setDelOpen(true);
  }
  const handleDelclose = () => {
    setDelOpen(false);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        marginTop: 15,
        flex: 1
      }}>

      <div style={{
         width : "50%"
      }} className='SearchDiv'>
        <div style={{ width : "40%"}}>
        <TextField
          required
          id="outlined-required"
          label="Deep Search"
          sx= {{ width : "100%"}}
          placeholder='Name of contact'
          onChange={(e) => {
            setSearchWord(e.target.value)
            setError('')
            if (e.target.value === '') {
              fetchFarmers()
            }
          }}
          value={searchWord}
        />
        </div>
        <div
          style={{
            cursor: 'pointer',
            marginLeft: 25,
          }}
          onClick={() => { getSearchFarmers() }}
        > <IconSearch />
        </div>
      </div>


      {loader === true ? <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}  className="CenterSpinner"><Spinner size='big' /></div> :
        <TableContainer component={Paper}>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Farmer No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell >Contact</TableCell>
                <TableCell >Location</TableCell>
                <TableCell >Products</TableCell>
                <TableCell >Gender</TableCell>
                <TableCell >No of Packages</TableCell>
                <TableCell >Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(farmers.length > 0 && error === "") ? farmers?.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope="row">{row.number}</TableCell>
                    <TableCell component='th' scope="row" onClick={() => onFarmerClick(SLUGS.farmer, row)} style={TableCellStyle}>
                      {row.name}</TableCell>
                    <TableCell component='th' scope="row">{row.contact}</TableCell>
                    <TableCell component='th' scope="row">{row.location}</TableCell>
                    <TableCell component='th' scope="row">{row.farmProducts.join(',')}</TableCell>
                    <TableCell component='th' scope="row">{row.gender.charAt(0).toUpperCase() + row.gender.slice(1)}</TableCell>
                    <TableCell component='th'
                      className="hoverPackage"
                      onClick={() => { handlepackagesView(row) }}
                      scope="row">{row.packages.length}</TableCell>
                    <TableCell component='th' scope="row">
                      <button
                       style={{
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => { handleDelopen(row) }}
                      className='DeleteButton'>
                      Delete
                    </button>
                    </TableCell>
                  </TableRow>
                );
              }) : null}
            </TableBody>

            {error && <div className="CenterSpinner">{error}</div>}
          </Table>
        </TableContainer>

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
            Are you sure you want to delete: {selectedFarmer.name}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => { handleDelclose() }}>Cancel</Button>

          <Button onClick={() => { DeleteFarmer() }}>
            {deleting ? <Spinner /> : 'Delete'}
          </Button>
        </DialogActions>
        {delError && <div className="errorTxt" style={{
          color: 'red'
        }} >
          {delError}
        </div>}
      </Dialog>
      
      <Dialog
        open={openPackages}
        onClose={handlepackagesClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Packages for" + " " + selectedFarmer.name}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Package</TableCell>
                  <TableCell >Total</TableCell>
                  <TableCell >State</TableCell>
                  <TableCell >Paid</TableCell>
                  <TableCell >Summary</TableCell>
                </TableRow>
              </TableHead>
              {(loader === false && Object.keys(selectedFarmer).length > 0) &&
                <TableBody>
                  {selectedFarmer.packages.map((row, index) => {
                    return (
                      <TableRow
                        key={index}
                        className='packCellHover'
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component='th' scope="row" style={TableCellStyle}>{row.name}
                        </TableCell>
                        <TableCell component='th' scope="row">{row.totalDue}</TableCell>
                        <TableCell component='th' scope="row">{row.status}</TableCell>
                        <TableCell component='th' scope="row">{row.balance}</TableCell>
                        <TableCell component='th' scope="row">{row.products.map((prod) => {
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
