
import React from 'react';
import {  Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import MiniCardComponent from 'components/cards/MiniCardComponent';
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
                        title='Unresolved'
                        value='60'
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Overdue'
                        value='16'
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
                        title='Open'
                        value='43'
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='On hold'
                        value='64'
                    />
                </Row>
            </Row>
            <div className={classes.todayTrends}>
                {/* <TodayTrendsComponent /> */}
            </div>
            <Row
                horizontal='space-between'
                className={classes.lastRow}
                breakpoints={{ 1024: 'column' }}
            >
             
            </Row>
    </div>
  )
}

export default ScratchCardProducts
