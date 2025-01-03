import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Grid, Paper } from '@mui/material';
import axios from '../../axios';
import { jsPDF } from 'jspdf';
import Spinner from 'components/Spinner';

const IndividualSavingStatement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [statement, setStatement] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSelectedContact(e.target.value);
  };

  const handleRetrieveStatement = async () => {
    if (!selectedContact) {
      setError('Please enter a valid contact.');
      return;
    }
    setError('');
    setIsLoading(true);

    const standardisedContact = '0' + selectedContact.slice(-9);

    try {
      const { data: userData } = await axios.get(`/farmer/users/${standardisedContact}`);
      const { data: statementData } = await axios.post(`/transactions/farmer/${standardisedContact}`);
      
      // Calculate total savings from transactions
      const totalSavings = statementData.data.reduce((total, transaction) => total + transaction.amount, 0);

      setStatement({
        farmer: userData.data, // farmer data
        transactions: statementData.data, // transaction details
        totalSavings,
      });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError('Statement with this contact does not exist. Please check the provided contact or try again later.');
      setStatement(null);
    }
  };

  const handleDownloadPDF = () => {
    if (!statement) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Individual Saving Statement', 10, 10);
    doc.setFontSize(12);
    doc.text(`Account Holder: ${statement.farmer.name}`, 10, 20);
    doc.text(`Contact: ${statement.farmer.contact}`, 10, 30);
    doc.text(`Location: ${statement.farmer.location}`, 10, 40);
    doc.text('Transactions:', 10, 60);

    let yOffset = 70;
    statement.transactions.forEach((transaction, index) => {
      const transactionDate = new Date(transaction.createdAt).toLocaleString(); // Format the date
      doc.text(
        `Payee: ${transaction.payee.name}, Contact: ${transaction.payee.contact}, Amount: $${transaction.amount}, Date: ${transactionDate}`,
        10,
        yOffset + index * 10
      );
    });

    doc.save('Saving_Statement.pdf');
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
            <Button variant="contained" color="primary" fullWidth onClick={handleRetrieveStatement}>
              {isLoading && <Spinner />}
              <span style={{ marginLeft: 5 }}>Retrieve Statement</span>
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {statement && (
          <>
            <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6">Transactions</Typography>
              <Typography variant="body1">
                <strong>Transactions:</strong>
              </Typography>
              <ul>
                {statement.transactions.map((transaction, index) => {
                  const transactionDate = new Date(transaction.createdAt).toLocaleString();
                  return (
                    <li key={transaction._id}>
                      <Typography variant="body2">
                        <strong>Payee:</strong> {transaction.payee.name} - <strong>Contact:</strong> {transaction.payee.contact} - <strong>Amount:</strong> {transaction.amount} - <strong>Date:</strong> {transactionDate}
                      </Typography>
                    </li>
                  );
                })}
              </ul>
            </Paper>
            <Button variant="contained" color="secondary" fullWidth onClick={handleDownloadPDF} sx={{ mt: 2 }}>
              Download as PDF
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default IndividualSavingStatement;
