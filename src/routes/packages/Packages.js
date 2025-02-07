import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Spinner from '../../components/Spinner';
import axios from '../../axios';
import { Row } from 'simple-flexbox';
import { useReactToPrint } from 'react-to-print';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import { formatNumber } from 'config';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import AddPackageModel from '../../components/AddPackageModel';

export default function BasicTable() {
    const [error, setError] = React.useState(false);
    const compRef = useRef();
    const [loader, setLoading] = React.useState(false);
    const [editing, setEditing] = React.useState(false);
    const [searchWord, setSearchWord] = React.useState('');
    const [totalPackages, setTotalPackages] = React.useState(0);
    const [totalPaid, setTotalPaid] = React.useState(0);
    const [totalDebt, setTotalDebt] = React.useState(0);
    const [packages, setPackages] = React.useState([]);
    const [delOpen, setDelOpen] = React.useState(false);
    const [selectedPackage, setSelectedPackage] = React.useState({});
    const [updatedName, setUpdatedName] = React.useState('');
    const [updatedAmount, setUpdatedAmount] = React.useState('');
    const [updateError, setUpdateError] = React.useState('');
    const [selectedProducts, setselectedProducts] = React.useState([]);
    const [selectedProductsNames, setselectedProductNames] = React.useState([]);
    const [searchPacks, setSearchPacks] = React.useState([]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const [prodError, setProdError] = React.useState('');

    const [products, setProducts] = React.useState([]);

    const getProducts = () => {
        axios
            .get(`/products`)
            .then((response) => {
                //back process
                setProducts(response.data.data);
            })
            .catch((error) => {
                setProdError('something went wrong');
            });
    };

    React.useEffect(() => {
        fetchPackages();
        getProducts();
    }, []);
    React.useEffect(() => {
        computeTotalAmount(packages);
    }, [packages]);

    const fetchPackages = () => {
        setLoading(true);
        axios
            .get(`/packages`)
            .then((response) => {
                setPackages(response.data.data);
                setLoading(false);
                console.log(response.data.data);
            })
            .catch((error) => {
                setError('something went wrong');
                setLoading(false);
            });
    };
    const searchFunction = (word) => {
        let searchResult = [];
        packages.forEach((element) => {
            if (element.name.toLowerCase().includes(word.toLowerCase())) {
                searchResult.push(element);
            }
        });
        setSearchPacks(searchResult);
    };
    const computeTotalAmount = async (data) => {
        if (!data || data.length === 0) {
            return 0;
        }
        const totalAmount = await data.reduce((sum, item) => {
            return sum + item.totalAmount;
        }, 0);
        const totalAmountPaid = await data.reduce((sum, item) => {
            return sum + item.balance;
        }, 0);
        setTotalPaid(totalAmountPaid);
        setTotalPackages(totalAmount);
        setTotalDebt(totalAmount - totalAmountPaid);
    };

    const PrintUserPackages = useReactToPrint({
        content: () => compRef.current
    });

    const handleDelopen = (selectedPackage) => {
        setSelectedPackage(selectedPackage);
        setUpdatedName(selectedPackage.name);
        setUpdatedAmount(selectedPackage.balance);
        setDelOpen(true);
    };

    const handleDelclose = () => {
        setDelOpen(false);
    };

    return (
        <>
            <div style={{ width: '40%' }} className='SearchDiv'>
                <TextField
                    required
                    id='outlined-required'
                    label='Search packages'
                    placeholder='package name'
                    sx={{
                        width: '100%'
                    }}
                    onChange={(e) => {
                        setSearchWord(e.target.value);
                        searchFunction(e.target.value);
                    }}
                    value={searchWord}
                />
            </div>

            <button
                onClick={() => {
                    PrintUserPackages();
                }}
                style={{ width: '15rem', marginBottom: '1rem', padding: 5 }}
            >
                Print Packages
            </button>
            <div ref={compRef}>
                {packages.length > 0 && (
                    <Row
                        className={{
                            marginTop: 30,
                            marginBottom: 30,
                            '@media (max-width: 768px)': {
                                marginTop: 0
                            }
                        }}
                        wrap
                        flexGrow={1}
                        horizontal='around'
                        breakpoints={{ 384: 'column' }}
                    >
                        <div style={{ margin: '5px 10px' }}>
                            <MiniCardComponent
                                className={{
                                    flexGrow: 1,
                                    marginRight: 30,
                                    '@media (max-width: 768px)': {
                                        marginTop: 30,
                                        maxWidth: 'none'
                                    }
                                }}
                                title={'Total Debt'}
                                value={`${totalDebt.toLocaleString('en-US')} UGX`}
                            />
                        </div>

                        <div style={{ margin: '5px 10px' }}>
                            <MiniCardComponent
                                className={{
                                    flexGrow: 1,
                                    marginRight: 30,
                                    '@media (max-width: 768px)': {
                                        marginTop: 30,
                                        maxWidth: 'none'
                                    }
                                }}
                                title={'Total Paid'}
                                value={`${totalPaid.toLocaleString('en-US')} UGX`}
                            />
                        </div>

                        <div style={{ margin: '5px 10px' }}>
                            <MiniCardComponent
                                className={{
                                    flexGrow: 1,
                                    marginRight: 30,
                                    '@media (max-width: 768px)': {
                                        marginTop: 30,
                                        maxWidth: 'none'
                                    }
                                }}
                                title={'Total on Packages'}
                                value={`${totalPackages.toLocaleString('en-US')} UGX`}
                            />
                        </div>
                    </Row>
                )}

                {loader === true ? (
                    <div
                        style={{
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className=''
                    >
                        <Spinner size='big' />
                    </div>
                ) : (
                    <TableContainer component={Paper} sx={{ marginTop: 8 }}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Package No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Amount paid</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Summary</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {searchWord === '' ? (
                                    packages.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell>{row.number}</TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.name}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {new Date(row.createdAt).toLocaleDateString(
                                                    'en-US'
                                                )}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.status}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {formatNumber(row.balance)}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {formatNumber(row.totalAmount)}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.products.map((prod) => {
                                                    return (
                                                        <div>
                                                            {prod.count} of- {prod.name} @{' '}
                                                            {prod.price}
                                                        </div>
                                                    );
                                                })}
                                            </TableCell>

                                            <TableCell component='th' scope='row'>
                                            <div
                                                    style={{
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                    {' '}
                                                    <AddPackageModel
                                                        products={products}
                                                        selectedPackage={row}
                                                        isEditMode={true}
                                                        prodError={prodError}
                                                        farmerId={null}
                                                    />{' '}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : searchPacks.lenght === 0 ? (
                                    <div className='CenterSpinner'>No search results</div>
                                ) : (
                                    searchPacks.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell>{row.number}</TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.name}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {new Date(row.createdAt).toLocaleString('en-US')}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.status}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.balance}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.totalAmount}
                                            </TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.products.map((prod) => {
                                                    return (
                                                        <div>
                                                            {prod.count} of- {prod.name} @{' '}
                                                            {prod.price}
                                                        </div>
                                                    );
                                                })}
                                            </TableCell>

                                            <TableCell component='th' scope='row'>
                                                <div
                                                    style={{
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                    {' '}
                                                    <AddPackageModel
                                                        products={products}
                                                        selectedPackage={row}
                                                        isEditMode={true}
                                                        prodError={prodError}
                                                        farmerId={null}
                                                    />{' '}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* <Dialog open={delOpen} onClose={handleDelclose} fullScreen={fullScreen}>
                    <DialogTitle>Edit Package</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Update the details of the selected package.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin='dense'
                            id='name'
                            label='Name'
                            type='text'
                            fullWidth
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />
                        <TextField
                            margin='dense'
                            id='amount'
                            label='Amount Paid'
                            type='number'
                            fullWidth
                            value={updatedAmount}
                            onChange={(e) => setUpdatedAmount(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDelclose} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdatePackage} color='primary' disabled={editing}>
                            {editing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogActions>
                </Dialog> */}
            </div>
        </>
    );
}
