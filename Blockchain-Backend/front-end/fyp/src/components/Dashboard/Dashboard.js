import React from 'react';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



export default function Dashboard() {
    async function logout(e) {
        e.preventDefault();
        sessionStorage.removeItem('token');
        window.location.assign("http://localhost:3000");
    }

    return (
        <Box sx={{ width: '100%' }}>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Item><Link to="/Add" className="btn btn-primary">Add New Resources</Link></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><Link to="/Query" className="btn btn-primary">Query Resources</Link></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><Link to="/Update" className="btn btn-primary">Update Resources</Link></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><Link to="/History" className="btn btn-primary">History</Link></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><Link to="/Delete" className="btn btn-primary">Delete Resources</Link></Item>
                </Grid>
                <Grid item xs={6}>
                    <Item><Link to="/" className="btn btn-primary">
                        <span onClick={logout}>Logout</span>
                    </Link></Item>
                </Grid>
                <Grid item xs={12}>
                    <Item><Link to="/Verify" className="btn btn-primary">Verify Resources</Link></Item>
                </Grid>
                <Grid item xs={12}>
                    <Item><Link to="/CreatePrivateData" className="btn btn-primary">Create Private Resource</Link></Item>
                </Grid>
                <Grid item xs={12}>
                    <Item><Link to="/RequestPrivateData" className="btn btn-primary">Request Private Resources</Link></Item>
                </Grid>
                <Grid item xs={12}>
                    <Item><Link to="/AddCHR" className="btn btn-primary">Add/Replace CHR certificate</Link></Item>
                </Grid>
                <Grid item xs={12}>
                    <Item><Link to="/QueryCHR" className="btn btn-primary">Query CHR certificate</Link></Item>
                </Grid>
            </Grid>
        </Box>
    );

}




