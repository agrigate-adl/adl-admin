import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Grid, Paper } from '@mui/material';
import axios from '../../axios';
import Spinner from 'components/Spinner';


const IndividualSavingStatement = () => {
  const [isLoading , setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [statement, setStatement] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSelectedContact(e.target.value);
  };

  const handleRetrieveStatement = async () => {

    if (!selectedContact) {
      setError("Please enter a valid contact.");
      return;
    }
    setError('');

    setIsLoading(true);

    const standardisedContact = '0' + selectedContact.slice(-9);

    try {

     const { data : userData } = await axios.get(`/farmer/users/${standardisedContact}`);
      // Replace with actual API endpoint ..
      const { data : statementData }= await axios.get(`/api/statements/${userData.data?._id}`);
      setStatement(statementData?.data);
      setIsLoading(false);

    } catch (err) {
      
      setIsLoading(false);
      setError('Statement with this contact does not exist the system. Please check the provided contact or try again later.');
      setStatement(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Retrieve Individual Saving Statement
        </Typography>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact"
              variant="outlined"
              value={selectedContact}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRetrieveStatement}
            >
              { isLoading && <Spinner />}
              <span style={{
                 marginLeft : 5
              }}>Retrieve Statement</span>
          
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {statement && (
          <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6">Saving Statement</Typography>
            <Typography variant="body1">
              <strong>Account Holder:</strong> {statement.accountHolder}
            </Typography>
            <Typography variant="body1">
              <strong>Account Number :</strong> {statement.accountNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Total Savings:</strong> ${statement.totalSavings}
            </Typography>
            <Typography variant="body1">
              <strong>Transactions:</strong>
            </Typography>
            <ul>
              {statement.transactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.date} - {transaction.type}: ${transaction.amount}
                </li>
              ))}
            </ul>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default IndividualSavingStatement;
