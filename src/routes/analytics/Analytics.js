import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useSelector } from 'react-redux';

function Analytics() {
    // Access the data from the Redux store
    const { packageData, error } = useSelector((state) => state.package);

    // Transform the Redux data into the format required for the BarChart
    const barData = packageData.reduce((acc, item) => {
        const month = new Date(item.createdAt).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
            acc[month] = { name: month, amount: 0 };
        }
        acc[month].amount += item.amount;
        return acc;
    }, {});

    // Convert the data into an array and sort by month
    const formattedData = Object.values(barData);

    return (
        <div style={{ margin: '20px' }}>
            <h3>Transactions </h3>
            {error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <BarChart
                    width={600}
                    height={400}
                    data={formattedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
            )}
        </div>
    );
}

export default Analytics;
