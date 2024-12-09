import React, { useEffect, useState } from 'react';
import { Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import axios from '../../axios';
import { IconSearch } from 'assets/icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Spinner from 'components/Spinner';


const TableCellStyle = {
    cursor: 'pointer'
};
const useStyles = createUseStyles({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    cardRow: {
        marginTop: 30,
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

export default function ScratchCardProducts() {
    const [Available, SetAvailable] = useState(-1);
    const [Unavailable, SetUnvailable] = useState(-1);
    const [Available20, SetAvailable20] = useState(-1);
    const [Available10, SetAvailable10] = useState(-1);
    const [Available50, SetAvailable50] = useState(-1);
    const [Available2, SetAvailable2] = useState(-1);
    const [Available1, SetAvailable1] = useState(-1);
    const [Available_5, SetAvailable_5] = useState(-1);
    const [Available5, SetAvailable5] = useState(-1);
    const [currentCard, SetCurrentCard] = useState({});
    const [searchWord, setSearchWord] = useState('');
    const [error, setError] = useState('');
    const [fetchCard, setFetchCard] = useState(false);
    const [openAdmin, setOpenAdmin] = React.useState(false);
    const [type, setTypeID] = React.useState('');
    const [admin, setAdmin] = React.useState({});
    const [adminLoader, setAdminLoader] = React.useState(false);

    useEffect(() => {
        async function fetchData() {
            await getAvailablecards();
            getUnAvailablecards();
            featuresSpacificCardCount('50000');
            featuresSpacificCardCount('20000');
            featuresSpacificCardCount('10000');
            featuresSpacificCardCount('5000');
            featuresSpacificCardCount('2000');
            featuresSpacificCardCount('1000');
            featuresSpacificCardCount('500');
        }
        fetchData();
    }, []);

    const getAvailablecards = () => {
        axios
            .post(`/cards/available`, { cardAmount: '' })
            .then((response) => {
                SetAvailable(response.data.count[0].count);
            })
            .catch((error) => {
                SetAvailable('failed');
            });
    };
    const getUnAvailablecards = () => {
        axios
            .post(`/cards/unavailable`, { cardAmount: '' })
            .then((response) => {
                SetUnvailable(response.data.count[0].count);
            })
            .catch((error) => {
                SetUnvailable('failed');
            });
    };
    const featuresSpacificCardCount = (amount) => {
        axios
            .post(`/cards/available`, { cardAmount: amount })
            .then((response) => {
                if (amount === '20000') {
                    SetAvailable20(response.data.count);
                }
                if (amount === '50000') {
                    SetAvailable50(response.data.count);
                }
                if (amount === '10000') {
                    SetAvailable10(response.data.count);
                }
                if (amount === '2000') {
                    SetAvailable2(response.data.count);
                }
                if (amount === '5000') {
                    SetAvailable5(response.data.count);
                }
                if (amount === '1000') {
                    SetAvailable1(response.data.count);
                }
                if (amount === '500') {
                    SetAvailable_5(response.data.count);
                }
            })
            .catch((error) => {
                if (amount === '20000') {
                    SetAvailable20('failed');
                }
                if (amount === '50000') {
                    SetAvailable50('failed');
                }
                if (amount === '10000') {
                    SetAvailable10('failed');
                }
                if (amount === '2000') {
                    SetAvailable2('failed');
                }
                if (amount === '5000') {
                    SetAvailable5('failed');
                }
                if (amount === '1000') {
                    SetAvailable1('failed');
                }
                if (amount === '500') {
                    SetAvailable_5('failed');
                }
            });
    };
    const getSearchCard = () => {
        if (searchWord === '') {
            return;
        }
        setFetchCard(true);
        axios
            .get(`/cards/${searchWord}`)
            .then((response) => {
                console.log(response);
                SetCurrentCard({ ...response.data.data });
                setFetchCard(false);
            })
            .catch((error) => {
                setError('failed to that card');
                SetCurrentCard({});
                setFetchCard(false);
            });
    };
    const fetchAdmin = (id,link) => {
        setAdminLoader(true);
        axios
            .get(`/${link}/${id}`)
            .then((response) => {
                console.log(response.data.data);
                setAdmin(response.data.data);
                setAdminLoader(false);
            })
            .catch((error) => {
                alert('failed to User, please try again later');
                setOpenAdmin(false)
                setAdminLoader(false);
            });
    };

    const classes = useStyles();
    const handleUserView = (id) => {
        setTypeID('admin');
        fetchAdmin(id,'admin');
        setOpenAdmin(true);
    };

    const handleFarmerView = (id) => {
        fetchAdmin(id,'farmer');
        setTypeID('farmer');
        setOpenAdmin(true);
    };
    
    const handlepackagesClose = () => {
        setOpenAdmin(false);
    };

    return (
        <div>
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{ 768: 'column' }}
            >
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Unsed Cards '
                        value={Available === -1 ? 'loading' : Available}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Used Cards'
                        value={Unavailable === -1 ? 'loading' : Unavailable}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='50,000 (Available Cards)'
                        value={Available50 === -1 ? 'loading' : Available50}
                    />
                </Row>
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='10,000 (Available Cards)'
                        value={Available10 === -1 ? 'loading' : Available10}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='20,000 (Available Cards)'
                        value={Available20 === -1 ? 'loading' : Available20}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='5000 (Available Cards)'
                        value={Available5 === -1 ? 'loading' : Available5}
                    />
                </Row>
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='2000 (Available Cards)'
                        value={Available2 === -1 ? 'loading' : Available2}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='1000 (Available Cards)'
                        value={Available1 === -1 ? 'loading' : Available1}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='500 (Available Cards)'
                        value={Available_5 === -1 ? 'loading' : Available_5}
                    />
                </Row>
            </Row>

            <h1 style={{ marginTop: 20, marginBottom: 10 }}>Add exact card number</h1>
            <div style={{ marginTop: 20, marginBottom: 10 , width: "50%" }} className='SearchDiv'>
                <TextField
                    required
                    sx= {{
                        width : "40%"
                    }}
                    id='outlined-required'
                    label='Card search'
                    placeholder='Exact card number'
                    onChange={(e) => {
                        setSearchWord(e.target.value);
                        setError('');
                        if (e.target.value === '') {
                            SetCurrentCard({});
                        }
                    }}
                    value={searchWord}
                />
                {fetchCard ? (
                    <div
                        style={{
                            marginLeft: 25
                        }}
                    >
                        Searching...
                    </div>
                ) : (
                    <div
                        style={{
                            cursor: 'pointer',
                            marginLeft: 25
                        }}
                        onClick={() => {
                            getSearchCard();
                        }}
                    >
                        <IconSearch />
                    </div>
                )}
            </div>
            {error && (
                <div
                    className='errorTxt'
                    style={{
                        color: 'red'
                    }}
                >
                    {error}
                </div>
            )}
            {Object.keys(currentCard).length > 0 && (
                <>
                    <div
                        style={{ border: '2px solid green', padding: '1rem', marginBottom: '1rem' }}
                    >
                        <h3 style={{ color: 'green' }}>Card Details</h3>
                        <div>
                            <strong>Amount:</strong> {currentCard.amount}
                        </div>
                        <div>
                            <strong>Card Number:</strong> {currentCard.cardNumber}
                        </div>
                        <div>
                            <strong>Created At:</strong>{' '}
                            {new Date(currentCard.createdAt).toLocaleString('en-US')}
                        </div>
                        <div 
                        onClick={() => {
                            handleFarmerView(currentCard.farmer);
                        }}
                        style={{color:'blue', cursor: 'pointer'}}>
                            <strong>Used by (FarmerId):</strong> {currentCard.farmer}
                        </div>
                        <div
                            onClick={() => {
                                handleUserView(currentCard.generatorID);
                            }}
                            style={{color:'blue', cursor: 'pointer'}}
                        >
                            <strong>Generator ID:</strong> {currentCard.generatorID}
                        </div>
                        <div>
                            <strong>Status:</strong> {currentCard.status}
                        </div>
                    </div>
                </>
            )}
            {openAdmin && <Dialog
                open={openAdmin}
                onClose={handlepackagesClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                {adminLoader ? (
                    <div className='CenterSpinner'>
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <DialogTitle id='alert-dialog-title'>
                            {'User' + ' : ' + admin.name}
                        </DialogTitle>
                        <DialogContent>
                            <TableContainer component={Paper}>
                                <Table aria-label='simple table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>{type==='admin'?'Email':'Contact' }</TableCell>
                                            <TableCell>{type==='admin'?'Role':'Gender' }</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {(adminLoader === false && Object.keys(admin).length >0) && (
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
                                                    {admin.name}
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                     {type==='admin'?admin.email:admin.contact}
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                     {type==='admin'?admin.role: admin.gender}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>
                        </DialogContent>{' '}
                    </>
                )}
            </Dialog>}
        </div>
    );
}
