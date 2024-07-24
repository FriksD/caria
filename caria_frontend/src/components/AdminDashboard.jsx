import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {adminLogout} from '../redux/adminSlice';
import {Button, AppBar, Toolbar, Typography, Container, Grid, Paper} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    VideoLibrary as VideoIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {currentAdmin} = useSelector((state) => state.admin);

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate('/admin/login');
    };

    const DashboardItem = ({title, icon, link}) => (
        <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3}
                   sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
                {icon}
                <Typography variant="h6" component="h2" sx={{mt: 2}}>
                    {title}
                </Typography>
                <Button component={Link} to={link} variant="contained" sx={{mt: 2}}>
                    管理
                </Button>
            </Paper>
        </Grid>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        视频平台后台管理系统
                    </Typography>
                    {currentAdmin && (
                        <>
                            <Typography variant="subtitle1" sx={{mr: 2}}>
                                欢迎, {currentAdmin.username}
                            </Typography>
                            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon/>}>
                                登出
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                <Grid container spacing={3}>
                    <DashboardItem title="总览" icon={<DashboardIcon fontSize="large"/>} link="/admin/dashboard"/>
                    <DashboardItem title="用户管理" icon={<PeopleIcon fontSize="large"/>} link="/admin/users"/>
                    <DashboardItem title="视频管理" icon={<VideoIcon fontSize="large"/>} link="/admin/videos"/>
                </Grid>
            </Container>
        </>
    );
}

export default AdminDashboard;