import  React,{useRef} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Spinner from '../../components/Spinner';
import axios from '../../axios';
import { Row } from 'simple-flexbox';
import { useReactToPrint } from 'react-to-print';
import MiniCardComponent from 'components/cards/MiniCardComponent';

export default function BasicTable() {
    const [error, setError] = React.useState(false);
    const compRef = useRef()
    const [loader, setLoading] = React.useState(false);
    const [searchWord, setSearchWord] = React.useState('');
    const [totalPackages, setTotalPackages] = React.useState(0);
    const [totalPaid, setTotalPaid] = React.useState(0);
    const [totalDebt, setTotalDebt] = React.useState(0);
    const [packages, setPackages] = React.useState([]);
    const [searchPacks, setSearchPacks] = React.useState([]);
    React.useEffect(() => {
        fetchPackages();
    }, []);
    React.useEffect(() => {
      computeTotalAmount(packages)
    }, [packages]);

    const fetchPackages = () => {
        setLoading(true);
        axios
            .get(`/packages`)
            .then((response) => {
                setPackages(response.data.data);
                setLoading(false);
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
      setTotalPaid(totalAmountPaid)
      setTotalPackages(totalAmount)
      setTotalDebt(totalAmount-totalAmountPaid);
    };
     
    const PrintUserPackages = useReactToPrint({
        content: () =>compRef.current
      })

    return (
        <>
            
            <div className='SearchDiv'>
                <TextField
                    required
                    id='outlined-required'
                    label='Search packages'
                    placeholder='package name'
                    onChange={(e) => {
                        setSearchWord(e.target.value);
                        searchFunction(e.target.value);
                    }}
                    value={searchWord}
                />
            </div>
            <button onClick={()=>{
               PrintUserPackages()
            }}
            style={{width:'20rem', marginBottom:'1rem'}}
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
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
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
                </Row>
            )}
            <TableContainer component={Paper}>
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
                        </TableRow>
                    </TableHead>
                    {loader === true ? (
                        <div className='CenterSpinner'>
                            <Spinner />
                        </div>
                    ) : (
                        <TableBody>
                            {searchWord === '' ? (
                                packages.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{row.number}</TableCell>
                                        <TableCell component='th' scope='row'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell component='th' scope='row'>
                                            {new Date(row.createdAt).toLocaleDateString('en-US')}
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
                                                        {prod.count} of- {prod.name} @ {prod.price}
                                                    </div>
                                                );
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : searchPacks.lenght === 0 ? (
                                <div className='CenterSpinner'>No seach results</div>
                            ) : (
                                searchPacks.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                                                        {prod.count} of- {prod.name} @ {prod.price}
                                                    </div>
                                                );
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            </div>
        </>
    );
}
