import * as React from 'react';
import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ConvertCSVToTable from './generate-table-format';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
    height: 600,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
  };

  type TableModalProps = {
      name: string;
	  dataUrl: string
  }



function TableModal(props: TableModalProps) {
    const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

    return(
        <>
        <Button onClick={handleOpen}>View Table Format</Button>
        <Modal
            open={open}
			onClose={handleClose}
			aria-labelledby="table-format"
			aria-describedby="view-covid-data-in-table-format"
		    >
			<Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Data Overview
                </Typography>
                <ConvertCSVToTable name={props.name} dataUrl={props.dataUrl}/>
			</Box>
		</Modal>
        </>
        
    );
}

export default TableModal;