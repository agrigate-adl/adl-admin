import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
import { Button, Container, Grid } from '@mui/material';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
// import { useSelector } from 'react-redux';
// import { selectUser } from 'features/userSlice';
import Spinner from '../../components/Spinner';
import axios from '../../axios';
import { OutlinedInput } from "@material-ui/core";

export default function BulkSms() {
    const [loader, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [feedBack, setFeedBack] = React.useState('');
    const [recipients, setRecipients] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('all');
    const [farmers, setFarmers] = React.useState([]);
    const [selectedFarmers, setSelectedFarmers] = React.useState([]);
    const [selectedFarmersNos, setSelectedFarmersNos] = React.useState([]);

    // Fetch farmers on component mount
    React.useEffect(() => {
        fetchFarmers();
    }, []);

    // Function to fetch farmers
    const fetchFarmers = () => {
        //setLoading(true);
        axios
            .get(`/farmer`)
            .then((response) => {
                setFarmers(response.data.data);
                //   setLoading(false);
            })
            .catch((error) => {
                setError('Something went wrong');
                //    setLoading(false);
            });
    };

    const handleCardsSubmit = () => {
        if (message !== '') {
            setLoading(true);
            let selected = false
            let farmerNos = []
            if (activeTab === 'selected') {
                selected = true
                farmerNos = selectedFarmers.map((farmer) => farmer.contact);
            }
            axios
                .post(`/ussd/v1/bulk-sms`, { farmers: farmerNos, selected: selected, message: message })
                .then((response) => {
                    // console.log(response.data.data.SMSMessageData.Message);
                    setLoading(false);
                    setError('');
                    setFeedBack(response.data.data.SMSMessageData.Message);
                    setRecipients(response.data.data.SMSMessageData.Recipients);
                })
                .catch((error) => {
                    setError('Something went wrong, please try again later');
                    setFeedBack('');
                    setRecipients([]);
                    setLoading(false);
                });
        } else {
            alert('Message can not be blank');
        }
    };
    const handleChange = (event) => {
        const {
            target: { value }
        } = event;
        // create objects
        let Value = value
        if (typeof value === 'string') {
            // On autofill we get a the stringified value.
            Value = value.split(",")
        }
        let farmerObjs = []
        Value.forEach((name, index) => {
            for (var n = 0; n < farmers.length; n++) {
                if (name === farmers[n].name) {
                    farmerObjs.push(farmers[n])
                }
            }
        });
        setSelectedFarmers(farmerObjs);
        setSelectedFarmersNos(Value)
    };

    return (

        <Container maxWidth="md">

            <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                    <div>
                        <div className='Tabs'>
                            <button
                                style={{
                                    borderRadius: "8px",
                                    padding: "2px 3px"
                                }}
                                className={activeTab === 'all' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('all');
                                }}
                            >
                                Send to All Farmers
                            </button>
                            <button
                                style={{
                                    borderRadius: "8px",

                                }}
                                className={activeTab === 'selected' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab('selected');
                                }}
                            >
                                Send to Selected Farmers
                            </button>
                        </div>
                        {activeTab === 'selected' && farmers.length > 0 && (
                            <div>
                                {/* <select>
                            {farmers.map((farmer) => (
                                <option key={farmer.id} value={farmer.number}>
                                    {farmer.name} - {farmer.number}
                                </option>
                            ))}
                        </select> */}

                                <Select
                                    labelId='demo-mutiple-checkbox-label'
                                    id='demo-mutiple-checkbox'
                                    multiple
                                    label='farmers'
                                    placeholder='Farmer 1, 2'
                                    className='SelectMultipleFieldSms'
                                    value={selectedFarmersNos}
                                    onChange={handleChange}
                                    input={<OutlinedInput label='Tag' />}
                                    renderValue={(selected) => selected.join(',')}
                                >
                                    {farmers.map((farm) => (
                                        <MenuItem className='menuItem' key={farm._id} value={farm.name}>
                                            <Checkbox
                                                checked={selectedFarmersNos.indexOf(farm.name) > -1}
                                            />
                                            <ListItemText primary={`${farm.name}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>

                </Grid>

                <Grid item xs={12}>
                    <Box
                        component='form'
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' }
                        }}
                        noValidate
                        autoComplete='off'
                    >
                        <div style={{
                            marginTop: 10,
                            marginBottom: 10
                        }}>
                            <TextField
                                helperText='Type the message you would want to send'
                                id='my-textarea'
                                label='Sms'
                                multiline
                                rows={4}
                                variant='outlined'
                                name='cost'
                                value={message}
                                style={{
                                    paddingBottom: '1rem',
                                    borderRadius: '8px',
                                    width: "100%",
                                    margin: '0 auto'
                                }}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                            />
                        </div>

                        <Button onClick={handleCardsSubmit} variant='outlined' style={{ height: 50, width: "100%", borderRadius: "10px" }}>
                            {loader && <Spinner />}
                            <span style={{
                                marginLeft: 5
                            }}> {'Send'} </span>

                        </Button>

                        {error && (
                            <div
                                style={{
                                    color: 'red',
                                    fontSize: '13px',
                                    width: '100%',
                                    display: 'flex',
                                    paddingTop: '2rem',
                                    paddingLeft: '0.5rem'
                                }}
                            >
                                {error}
                            </div>
                        )}
                        {feedBack && (
                            <div
                                style={{
                                    color: 'green',
                                    fontSize: '13px',
                                    width: '100%',
                                    display: 'flex',
                                    paddingTop: '2rem',
                                    paddingLeft: '0.5rem'
                                }}
                            >
                                {feedBack}
                            </div>
                        )}

                        {recipients.length > 0 && (
                            <div>
                                {recipients.map((item, index) => (
                                    <div key={index}>
                                        <p>
                                            Status: <span style={{ color: 'green' }}>{item.status}</span>
                                        </p>
                                        <p>
                                            Number: <span style={{ color: 'blue' }}>{item.number}</span>
                                        </p>
                                        <p>
                                            Code: <span style={{ color: 'red' }}>{item.statusCode}</span>
                                        </p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Box>

                </Grid>

            </Grid>

        </Container>

    );
}
