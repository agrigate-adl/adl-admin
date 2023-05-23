import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';

// import { useSelector } from 'react-redux';
// import { selectUser } from 'features/userSlice';
import Spinner from '../../components/Spinner';
import axios from '../../axios';

export default function BulkSms() {
    const [loader, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [feedBack, setFeedBack] = React.useState('');
    const [recipients, setRecipients] = React.useState([]);

    //const user = useSelector(selectUser);

    const handleCardsSubmit = () => {
        if (message !== '') {
            setLoading(true);
            axios
                .post(`/ussd/v1/bulk-sms`, { message: message })
                .then((response) => {
                    console.log(response.data.data.SMSMessageData.Message)
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

    return (
        <>
            <Box
                component='form'
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }
                }}
                noValidate
                autoComplete='off'
            >
                <div></div>
                <div>
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
                            paddingBottom: '1rem'
                        }}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                    />
                </div>
                {loader === true ? (
                    <Spinner />
                ) : (
                    <Button onClick={handleCardsSubmit} variant='outlined' style={{ height: 50 }}>
                        {'Send to all farmers'}
                    </Button>
                )}
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
                {recipients.length >0 &&
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
                }
            </Box>
        </>
    );
}
