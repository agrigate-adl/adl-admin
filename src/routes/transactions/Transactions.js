import React, { useCallback, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle
} from '@mui/material';
import axios from '../../axios';
import Spinner from '../../components/Spinner';
import { IconSearch } from 'assets/icons';
import { createUseStyles } from 'react-jss';
import { Row } from 'simple-flexbox';
import { useReactToPrint } from 'react-to-print';
import MiniCardComponent from 'components/cards/MiniCardComponent';

const TableCellStyle = { cursor: 'pointer' };

export default function BasicTable() {
    const [stati, setStati] = React.useState(false);
    const compRef = useRef();
    const [error, setError] = React.useState(false);
    const [errorPack, setErrorPack] = React.useState(false);
    const [openPackages, setOpenPackages] = React.useState(false);
    const [selectedID, setSelectedID] = React.useState('');
    const [packaged, setPackaged] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const [transactions, setTransactions] = React.useState([]);
    const [searchWord, setSearchWord] = React.useState('');
    const [filteredTransactions, setFilteredTransactions] = React.useState([]);

    const useStyles = createUseStyles({
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
        }
    });

    const handlePackagesView = (id) => {
        setSelectedID(id);
        fetchPackage(id);
        setOpenPackages(true);
    };

    const handlePackagesClose = () => setOpenPackages(false);

    const fetchPackage = (id) => {
        setLoader(true);
        axios
            .get(`/packages/${id}`)
            .then((response) => {
                setPackaged(response.data.data);
                setLoader(false);
            })
            .catch(() => {
                setErrorPack('Something went wrong');
                setLoader(false);
            });
    };

    const searchFunction = useCallback(() => {
        if (searchWord) {
            const lowerSearchWord = searchWord.toLowerCase();
            const filtered = transactions.filter((transaction) => {
                const id = transaction?._id;
                const packId = transaction?.package;
                const contact = transaction.payee?.contact.toLowerCase();
                const amount = transaction?.amount.toString().toLowerCase();
                const name = transaction.payee?.name.toLowerCase();
                return (
                    contact?.includes(lowerSearchWord) ||
                    id?.includes(searchWord) ||
                    name?.includes(lowerSearchWord) ||
                    packId?.includes(searchWord) ||
                    amount?.includes(searchWord)
                );
            });
            setFilteredTransactions(filtered);
        } else {
            setFilteredTransactions(transactions);
        }
    }, [searchWord, transactions]);

    const fetchTransactions = useCallback(() => {
        setStati(true);
        axios
            .get(`/transactions`)
            .then((response) => {
                const sortedData = sortRecords(response.data.data);
                setTransactions(sortedData);
                setFilteredTransactions(sortedData);
                setStati(false);
            })
            .catch(() => {
                setError('Something went wrong');
                setStati(false);
            });
    }, []);

    React.useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    React.useEffect(() => {
        searchFunction();
    }, [searchWord, searchFunction]);

    const sortRecords = (transactionList) => {
        return transactionList.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    };

    const computeTotalAmount = (data) => {
        if (!data || data.length === 0) return 0;
        return data.reduce((sum, item) => sum + item.amount, 0);
    };

    const PrintComponent = useReactToPrint({
        content: () => compRef.current
    });

    const classes = useStyles();

    return (
        <div className={classes.holderCard}>
            <div className='SearchDiv'>
                <TextField
                    required
                    id='outlined-required'
                    label='Search transactions'
                    placeholder='Id, name, contact, amount, or packageId'
                    onChange={(e) => setSearchWord(e.target.value)}
                    value={searchWord}
                />
                <div
                    style={{ cursor: 'pointer', marginLeft: 25 }}
                    onClick={searchFunction}
                >
                    <IconSearch />
                </div>
            </div>
            <button onClick={PrintComponent} style={{ width: '20rem' }}>
                Print transactions
            </button>
            <div ref={compRef}>
                {filteredTransactions.length > 0 && (
                    <Row className={classes.cardRow} wrap flexGrow={1} horizontal='space-between'>
                        <MiniCardComponent
                            className={classes.miniCardContainer}
                            title={"Total accumulated"}
                            value={`${computeTotalAmount(filteredTransactions).toLocaleString('en-US')} UGX`}
                        />
                    </Row>
                )}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Payee Name</TableCell>
                                <TableCell align='center'>Contact</TableCell>
                                <TableCell align='center'>Date</TableCell>
                                <TableCell align='center'>Amount</TableCell>
                                <TableCell align='right' style={{ color: 'blue' }}>Package ID</TableCell>
                            </TableRow>
                        </TableHead>
                        {stati ? (
                            <div className='CenterSpinner'><Spinner /></div>
                        ) : (
                            <TableBody>
                                {filteredTransactions.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.payee?.name}</TableCell>
                                        <TableCell>{row.payee?.contact}</TableCell>
                                        <TableCell align='center'>
                                            {new Date(row.createdAt).toLocaleString('en-US')}
                                        </TableCell>
                                        <TableCell align='center'>{row.amount}</TableCell>
                                        <TableCell
                                            align='right'
                                            onClick={() => handlePackagesView(row.package)}
                                            style={{ color: 'blue' }}
                                        >
                                            {row.package}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {error && <div className='CenterSpinner'>{error}</div>}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </div>
            <Dialog open={openPackages} onClose={handlePackagesClose}>
                {loader ? (
                    <div className='CenterSpinner'><Spinner /></div>
                ) : (
                    <>
                        <DialogTitle>Package: {packaged.name}</DialogTitle>
                        <DialogContent>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Package</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>State</TableCell>
                                            <TableCell>Paid</TableCell>
                                            <TableCell>Summary</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{packaged.name}</TableCell>
                                            <TableCell>{packaged.totalAmount}</TableCell>
                                            <TableCell>{packaged.status}</TableCell>
                                            <TableCell>{packaged.balance}</TableCell>
                                            <TableCell>
                                                {packaged?.products?.map((prod) => (
                                                    <div key={prod.name}>
                                                        {prod.count} of {prod.name} @ {prod.price}
                                                    </div>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                    </>
                )}
                {errorPack && <div className='CenterSpinner'>{errorPack}</div>}
            </Dialog>
        </div>
    );
}
