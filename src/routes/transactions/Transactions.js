import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, date, amount, location, packages) {
  return {name, date, amount, location, packages };
}

const rows = [
  createData('Cha', 2345566788, 2900, 'Mbale', 4.0),
  createData('Khn', 1223455556, 4000, 'Mukono', 4.3),
  createData('Matia', 222344445, 4500, 'Jinja', 6.0),
  createData('Admu', 112335666, 5000, 'Masaka', 4.3),
  createData('Edda', 233455555, 6000, 'Sorot', 3.9),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Crops &nbsp;</TableCell>
            <TableCell align="right">Amount &nbsp;</TableCell>
            <TableCell align="right">Packages &nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.packages}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
