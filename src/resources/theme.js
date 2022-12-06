const color = {
    brightGreen: '#02ff01',
    darkGreenishVibe: '#01cd00',
    darkRed: '#a90000',
    greenishVibe: '#00cd66',
    greenishVibe2: '#00e773',
    greenishVibe3: '#01ff80',
    lightGreen: '#34ff67',
    lightGreenIshVibe: '#90eea8', // background color
    lightGreenIshVibe2: '#a6f1b9',
    paleGreen: '#ceffda',
    paleGreenTransparent: 'rgba(81, 100, 85, 0.08)',
    veryDarkGreenishVibe: 'rgb(0, 10, 0)'
};

const typography = {
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 19,
        lineHeight: '24px',
        letterSpacing: '0.4px'
    },
    smallSubtitle: {
        fontSize: 12,
        lineHeight: '16px',
        letterSpacing: '0.1px'
    },
    link: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: color.lightGreen,
        textAlign: 'right',
        cursor: 'pointer',
        textDecoration: 'underline',
        '&:hover': {
            color: color.greenishVibe
        }
    },
    itemTitle: {
        fontWeight: 600,
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: 0.2
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: '30px',
        letterSpacing: 0.3
    }
};

export default {
    color,
    typography
};
