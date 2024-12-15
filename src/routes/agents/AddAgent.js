import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Grid, MenuItem } from '@mui/material';
import Spinner from 'components/Spinner';
import axios from '../../axios';

const AddAgent = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission ..
    setLoading(true);
    console.log('Submitted data::-->', formData);

    if (formData.name !== '' && formData.contact !== '' && formData.email !== '' && formData.password !== '') {

      axios
        .post(`/admin/register-agent`, formData)
        .then((response) => {
          // console.log(response.data.data)
          setLoading(false);
          window.location.href = '/dashboard';
        })
        .catch((error) => {
          // console.log("RETURNED_ERROR", error.response.data.message);
          alert(error.response.data.message);
          setError('something went wrong');
          setLoading(false);
        });
    } else {
      alert('All field must be filled');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Add Agent
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>


            <Grid item xs={12}>
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
                label="Password"
                name="password"
                variant="outlined"
                value={formData.password}
                type="password"
                autoComplete="current-password"
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {loading && <Spinner />} <span style={{ marginLeft: 2 }}>
                  {loading ? "Submitting Agent .." : "Submit Agent"}
                </span>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default AddAgent;
