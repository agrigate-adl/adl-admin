// Staging Url
export const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

