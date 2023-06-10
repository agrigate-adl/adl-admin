import React, { useCallback, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import axios from '../../axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Spinner from '../../components/Spinner';
import { IconSearch } from 'assets/icons';
import { createUseStyles } from 'react-jss';
import { Row } from 'simple-flexbox';
import { useReactToPrint } from 'react-to-print';
import MiniCardComponent from 'components/cards/MiniCardComponent';


const TableCellStyle = {
    cursor: 'pointer'
};

export default function BasicTable() {
    const [stati, setStati] = React.useState(false);
    const compRef = useRef()
    const [error, setError] = React.useState(false);
    const [errorPack, setErrorPack] = React.useState(false);
    const [openPackages, setOpenPackages] = React.useState(false);
    const [selectedID, setSelectedID] = React.useState('');
    const [packaged, setPackaged] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const [transactions, setTrasactions] = React.useState([]);
    const [searchWord, setSearchWord] = React.useState('');
    const useStyles = createUseStyles({
        cardsContainer: {
            marginRight: -30,
            marginTop: -30
        },
        holderCard: {
          display: 'flex',
          flexDirection: 'column'
      },
        cardRow: {
            marginTop: 30,
            marginBottom: 10,
            '@media (max-width: 768px)': {
                marginTop: 0
            }
        },
        miniCardContainer: {
            flexGrow: 1,
            marginRight: 30,
            '@media (max-width: 768px)': {
                marginTop: 30,
                maxWidth: 'none'
            }
        },
        todayTrends: {
            marginTop: 30
        },
        lastRow: {
            marginTop: 30
        },
        unresolvedtransactions: {
            marginRight: 30,
            '@media (max-width: 1024px)': {
                marginRight: 0
            }
        },
        tasks: {
            marginTop: 0,
            '@media (max-width: 1024px)': {
                marginTop: 30
            }
        }
    });

    const handlepackagesView = (id) => {
        setSelectedID(id);
        fetchPackage(id);
        setOpenPackages(true);
    };
    const handlepackagesClose = () => {
        setOpenPackages(false);
    };
    const fetchPackage = (id) => {
        //console.log(id);
        setLoader(true);
        axios
            .get(`/packages/${id}`)
            .then((response) => {
                //  console.log(response)
                setPackaged(response.data.data);
                setLoader(false);
            })
            .catch((error) => {
                setErrorPack('something went wrong');
                setLoader(false);
            });
    };
    const searchFunction = useCallback(async () => {
        if (searchWord !== '' && transactions.length > 0) {
            const filteredTransactions = transactions.filter((transaction) => {
                const id = transaction._id;
                const packId = transaction.package;
                const contact = transaction.payee.contact.toLowerCase();
                const amount = transaction.amount.toString().toLowerCase();
                const name = transaction.payee.name.toLowerCase();
                const searchTerm = searchWord.toLowerCase();
                return (
                    contact.includes(searchTerm) ||
                    id.includes(searchWord) ||
                    name.includes(searchTerm) ||
                    packId.includes(searchWord) ||
                    amount.includes(searchTerm)
                );
            });
            setTrasactions(await sortRecords(filteredTransactions));
        }
    }, [searchWord, transactions]);

    const fetchTransactions = useCallback(async () => {
        setStati(true);
        axios
            .get(`/transactions`)
            .then(async (response) => {
                if (response.data.data.length === 0) {
                    setError('No transactions fetched');
                }
                setTrasactions(await sortRecords(response.data.data));
                setStati(false);
            })
            .catch((error) => {
                setError('Something went wrong');
                setStati(false);
            });
    }, []);
    React.useEffect(() => {
        if (searchWord === '') {
            fetchTransactions();
        }
    }, [searchWord, fetchTransactions]);

    React.useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const sortRecords = (transactionList) => {
        return transactionList.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    };

    const computeTotalAmount = (data) => {
        if (!data || data.length === 0) {
            return 0;
        }
        const totalAmount = data.reduce((sum, item) => {
          return sum + item.amount;
        }, 0);
        return totalAmount;
    };

    const PrintComponent = useReactToPrint({
        content: () =>compRef.current
    });

    const classes = useStyles();
    return (
        <div className={classes.holderCard}>
             
              <div className='SearchDiv'>
                <TextField
                    required
                    id='outlined-required'
                    label='Search transactions'
                    placeholder='Id,name,contact,amount or packageId'
                    onChange={(e) => {
                        setSearchWord(e.target.value);
                    }}
                    value={searchWord}
                />
                <div
                    style={{
                        cursor: 'pointer',
                        marginLeft: 25
                    }}
                    onClick={() => {
                        searchFunction();
                    }}
                >
                    {' '}
                    <IconSearch />
                </div>
            </div>
            <button onClick={()=>{
               PrintComponent()
            }}
            style={{width:'20rem'}}
            >
                Print transactions
            </button>
            <div ref={compRef} >
            {transactions.length > 0 && <Row
                  className={classes.cardRow}
                  wrap
                  flexGrow={1}
                  horizontal='space-between'
                  breakpoints={{ 384: 'column' }}
              >  
                  <MiniCardComponent
                      className={classes.miniCardContainer}
                      title={"Total accumulated"}
                      value={`${computeTotalAmount(transactions).toLocaleString('en-US')} UGX`}
                  />
              </Row>
              }
            <TableContainer  component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Payee Name</TableCell>
                            <TableCell align='center'>Contact</TableCell>
                            <TableCell align='center'>Date</TableCell>
                            <TableCell align='center'>Amount &nbsp;</TableCell>
                            <TableCell
                                align='right'
                                style={{
                                    color: 'blue'
                                }}
                            >
                                Package ID &nbsp;
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {stati ? (
                        <div className='CenterSpinner'>
                            <Spinner />
                        </div>
                    ) : (
                        <TableBody>
                            {transactions.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component='th' scope='row'>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell component='th' scope='row'>
                                        {row.payee.name}
                                    </TableCell>
                                    <TableCell component='th' scope='row'>
                                        {row.payee.contact}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {new Date(row.createdAt).toLocaleString('en-US')}
                                    </TableCell>
                                    <TableCell align='center'>{row.amount}</TableCell>
                                    <TableCell
                                        align='right'
                                        onClick={() => {
                                            handlepackagesView(row.package);
                                        }}
                                        style={{
                                            color: 'blue'
                                        }}
                                    >
                                        {row.package}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {error !== '' && <div className='CenterSpinner'>{error}</div>}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            </div>
            <Dialog
                open={openPackages}
                onClose={handlepackagesClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                {loader ? (
                    <div className='CenterSpinner'>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <DialogTitle id='alert-dialog-title'>
                            {'Package' + ' : ' + packaged.name}
                        </DialogTitle>
                        <DialogContent>
                            <TableContainer component={Paper}>
                                <Table aria-label='simple table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Package</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>State</TableCell>
                                            <TableCell>Paid</TableCell>
                                            <TableCell>Summary</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loader === false && (
                                        <TableBody>
                                            <TableRow
                                                className='packCellHover'
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0
                                                    }
                                                }}
                                            >
                                                <TableCell
                                                    component='th'
                                                    scope='row'
                                                    style={TableCellStyle}
                                                >
                                                    {packaged.name}
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                    {packaged.totalAmount}
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                    {packaged.status}
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                    {packaged.balance}
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                    {packaged?.products?.map((prod) => {
                                                        return (
                                                            <div>
                                                                {prod.count} of- {prod.name} @{' '}
                                                                {prod.price}
                                                            </div>
                                                        );
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>
                        </DialogContent>{' '}
                    </>
                )}
                {errorPack !== '' && <div className='CenterSpinner'>{errorPack}</div>}
            </Dialog>
        </div>
    );
}

