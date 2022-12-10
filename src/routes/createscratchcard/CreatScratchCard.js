import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';

const currencies = [
  {
    value: 'ugShs',
    label: '23',
  },
  {
    value: 'ugshs',
    label: '22',
  },
  {
    value: 'ugshs',
    label: '22',
  },
  {
    value: 'ugsh',
    label: '235',
  },
];



export default function SelectTextFields() {
  const [currency, setCurrency] = React.useState('ugshs');
  const [ , setNumberOfcard ]=React.useState("223")
  const handleChange = (event) => {
    setCurrency(event.target.value);
    setNumberOfcard(event.target.value);
  };

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
        label="Name"
      />
      <TextField
          id="standard-select-currency"
          select
          label="Select"
          value={currency}
          onChange={handleChange}
          helperText="Please select your Number of Scratch Card"
          variant="standard"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
       
      </div>
     
      <div>
       
      <TextField
        helperText="Please enter your scratch card"
        id="demo-helper-text-aligned"
        label="Cost"
      />

      
      </div>
      <Button variant="outlined" style= {{width:80,height:50}}> Create</Button>
    </Box>
  );
}
