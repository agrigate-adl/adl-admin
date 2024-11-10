import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';

const IndividualSavingStatement = () => {
  const [userId, setUserId] = useState('');
  const [statement, setStatement] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handleRetrieveStatement = async () => {
    if (!userId) {
      setError("Please enter a valid User ID.");
      return;
    }
    setError('');
    
    try {
      // Replace with actual API endpoint
      const response = await axios.get(`/api/statements/${userId}`);
      setStatement(response.data);
    } catch (err) {
      setError('Unable to retrieve statement. Please check the User ID or try again later.');
      setStatement(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Retrieve Individual Saving Statement
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="User ID"
              variant="outlined"
              value={userId}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRetrieveStatement}
            >
              Retrieve Statement
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
