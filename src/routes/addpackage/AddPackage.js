import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
      <TextField
        helperText="Please enter your scratch card"
        id="demo-helper-text-aligned"
        label="Package Name"
      />
      <TextField
        helperText="Please enter your scratch card"
        id="demo-helper-text-aligned"
        label="Description"
      />
      </div>
     
      <div>
       
      <TextField
        helperText="Please enter your scratch card"
        id="demo-helper-text-aligned"
        label="Cost"
      />
      <TextField
        helperText="Please enter your scratch card"
        id="demo-helper-text-aligned"
        label="Name"
      />
      
      </div>
      <Button variant="outlined" style= {{width:90,height:100}}> Add Package</Button>
    </Box>
  );
}
