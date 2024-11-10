import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Grid, MenuItem } from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';

const PayoutCash = () => {
  const [formData, setFormData] = useState({
    creditorName: '',
    residence: '',
    contact:'',
    loanValue: '',
    paymentPeriod: '',
    interestRate: '',
    supportingDocuments: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocuments: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., sending data to backend
    console.log('Submitted data:', formData);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Credit System Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Creditor Name"
                name="creditorName"
                variant="outlined"
                value={formData.creditorName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="Address"
                variant="outlined"
                value={formData.residence}
                onChange={handleChange}
                required
              />

              
            </Grid>


            <Grid  item xs={12}>
            <TextField
                fullWidth
                label="Phone Number"
                name="contact"
                variant="outlined"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Loan Value"
                name="loanValue"
                variant="outlined"
                type="number"
                value={formData.loanValue}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Period (Months)"
                name="paymentPeriod"
                variant="outlined"
                type="number"
                value={formData.paymentPeriod}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Interest Rate (%)"
                name="interestRate"
                variant="outlined"
                type="number"
                value={formData.interestRate}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth
              >
                Upload Supporting Documents
                <input
                  type="file"
                  name="supportingDocuments"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
              {formData.supportingDocuments && (
                <Typography variant="body2" color="textSecondary">
                  {formData.supportingDocuments.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit Credit Application
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default PayoutCash;
