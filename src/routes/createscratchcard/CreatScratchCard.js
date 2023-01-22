import React, {useRef,useEffect} from 'react';

import { useReactToPrint } from 'react-to-print';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';

import { useSelector } from 'react-redux';
import { selectUser } from 'features/userSlice';
import Spinner from '../../components/Spinner';
import axios from '../../axios'

const currencies = [
  {
    value: "1",
    label: '1',
  },
  {
    value: "5",
    label: '5',
  },
  {
    value: "20",
    label: '20',
  },
  {
    value:  '30',
    label: '30',
  },
  {
    value: "50",
    label: '50',
  },
];


export default function SelectTextFields() {
  const compRef = useRef()
  const [currency, setCurrency] = React.useState("5");
  const [loader, setLoading] = React.useState(false);
  const [error,setError] = React.useState('')
  const [ cardNumbers , setNumberOfcard ]=React.useState("5");
  const [cost,setCost]=React.useState("");
  const [cards,setCard] = React.useState([])
  const user = useSelector(selectUser);

  const handleChange = (event) => {
    setCurrency(event.target.value);
    setNumberOfcard(event.target.value);
  };
  useEffect(() => {
   PrintCards()
 }, [cards]);
  const handleCardsSubmit =()=>{
    setLoading(true)
    if(cardNumbers !== '' && cost !==''){
    const obj  ={
      generatorID:user.id,
      count:cardNumbers,
      amount:cost
    }
    axios
    .post(`/cards/print-newcards`,obj)
    .then((response) => {
       console.log(response.data.data)
      setLoading(false)
      setCard(response.data.data)
     // window.location.href = "/scratchCards"
     //PrintCards()
    }).catch((error) => {
      setError("something went wrong")
      setLoading(false)
    });
  }else{
    alert('fill all fields please')
  } 
  }
  const PrintCards = useReactToPrint({
    content: () =>compRef.current
  })
  return (
    <>
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
        label="Card cost"
        name='cost'
        value={cost}
        style={{
          paddingBottom:'1rem'
        }}
        onChange={(e)=>{setCost(e.target.value)}}
      />     
      </div>
      {loader===true? <Spinner/> :
      <Button onClick={handleCardsSubmit} variant="outlined" style= {{height:50}}>
         Create & Print
        </Button> 
     }
     {cards.length>0 &&<ComponentToPrint cards={cards} ref={compRef}/>}
    </Box>
    </>
  );
}

export const ComponentToPrint = React.forwardRef((props,ref) => {
    return(
      <div ref={ref} className='Printableholder'>
      {props.cards.map((item,index)=>(
        <div key={index} className='SingleCard'>
          <div style={{backgroundColor:'#fff', color:'#000'}}>Dail: {item.cardNumber}</div>
          <div style={{color:'#csolor'}}>Worth, {item.amount} Ugx</div>
        </div>
      ))
      }
      </div>
    )
})