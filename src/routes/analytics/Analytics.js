import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import axios from '../../axios';

function Analytics() {
    const [barData, setBarData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/transactions/monthly_data');
                const { data } = response.data;
                setBarData(data);
            } catch (err) {
                setError('Failed to fetch transactions data');
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ margin: '20px' }}>
            <h3>Transactions Per Year</h3>
            {error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <BarChart
                    width={800}
                    height={400}
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                        <Bar key={month} dataKey={month} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                </BarChart>
            )}
        </div>
    );
}

export default Analytics;
