import * as React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ConvertCSVToTable from './generate-table-format';
const style = {
    position: 'absolute',
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
function TableModal(props) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { onClick: handleOpen }, "View Table Format"),
        React.createElement(Modal, { open: open, onClose: handleClose, "aria-labelledby": "table-format", "aria-describedby": "view-covid-data-in-table-format" },
            React.createElement(Box, { sx: style },
                React.createElement(Typography, { id: "modal-modal-title", variant: "h5", component: "h2" }, "Data Overview"),
                React.createElement(ConvertCSVToTable, { name: props.name, dataUrl: props.dataUrl })))));
}
export default TableModal;
