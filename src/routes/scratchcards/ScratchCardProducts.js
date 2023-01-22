
import React,{useEffect,useState} from 'react';
import {  Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import axios from '../../axios'
const useStyles = createUseStyles({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 30,
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    },
    todayTrends: {
        marginTop: 30
    },
    lastRow: {
        marginTop: 30
    },
    unresolvedtransactions: {
        marginRight: 30,
        '@media (max-width: 1024px)': {
            marginRight: 0
        }
    },
    tasks: {
        marginTop: 0,
        '@media (max-width: 1024px)': {
            marginTop: 30
        }
    }
});


function ScratchCardProducts() {
    const [Available, SetAvailable] = useState(-1)
    const [Unavailable, SetUnvailable] = useState(-1)
    const [Available20, SetAvailable20] = useState(-1)
    const [Available10, SetAvailable10] = useState(-1)
    const [Available50, SetAvailable50] = useState(-1)
    const [Available2, SetAvailable2] = useState(-1)
    const [Available1, SetAvailable1] = useState(-1)
    const [Available5, SetAvailable5] = useState(-1)
    useEffect(() => {
        getAvailablecards();
        getUnAvailablecards();
        featuresSpacificCardCount("50000");
        featuresSpacificCardCount("20000");
        featuresSpacificCardCount("10000");
        featuresSpacificCardCount("5000");
        featuresSpacificCardCount("2000");
        featuresSpacificCardCount("1000");
     }, []);
 const getAvailablecards =()=>{
   axios
   .post(`/cards/available`,{cardAmount:""})
   .then((response) => {
    SetAvailable(response.data.count[0].count)
   }).catch((error) => {
    SetAvailable("failed")
   });
 }
 const getUnAvailablecards =()=>{
   axios
   .post(`/cards/unavailable`,{cardAmount:""})
   .then((response) => {
    SetUnvailable(response.data.count[0].count)
   }).catch((error) => {
    SetUnvailable("failed")
   });
 }
 const featuresSpacificCardCount = (amount) =>{
   axios
   .post(`/cards/available`,{cardAmount:amount})
   .then((response) => {
    if(amount === "20000"){
        SetAvailable20(response.data.count)
    }
    if(amount === "50000"){
        SetAvailable50(response.data.count)
    }
    if(amount === "10000"){
        SetAvailable10(response.data.count)
    }
    if(amount === "2000"){
        SetAvailable2(response.data.count)
    }
    if(amount === "5000"){
        SetAvailable5(response.data.count)
    }
    if(amount === "1000"){
        SetAvailable1(response.data.count)
    }
   }).catch((error) => {
    if(amount === "20000"){
        SetAvailable20('failed')
    }
    if(amount === "50000"){
        SetAvailable50('failed')
    }
    if(amount === "10000"){
        SetAvailable10('failed')
    }
    if(amount === "2000"){
        SetAvailable2('failed')
    }
    if(amount === "5000"){
        SetAvailable5('failed')
    }
    if(amount === "1000"){
        SetAvailable1('failed')
    }
   });
 }

const classes = useStyles()
  return (
    <div>
         <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{ 768: 'column' }}
            >
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Unsed Cards '
                        value={Available===-1?'loading':Available}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Used Cards'
                        value={Unavailable===-1?'loading':Unavailable}
                    />
                </Row>
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='50,000K (Available Cards)'
                        value={Available50===-1?'loading':Available50}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='10,000K (Available Cards)'
                        value={Available10===-1?'loading':Available10}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='20,000K (Available Cards)'
                        value={Available20===-1?'loading':Available20}
                    />
                </Row>
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='5000K (Available Cards)'
                        value={Available5===-1?'loading':Available5}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='2000K (Available Cards)'
                        value={Available2===-1?'loading':Available2}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='1000K (Available Cards)'
                        value={Available1===-1?'loading':Available1}
                    />
                </Row>
            </Row>
  
        
    </div>
  )
}

export default ScratchCardProducts
