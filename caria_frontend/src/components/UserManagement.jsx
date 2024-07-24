import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Container, Typography, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Snackbar, IconButton
} from '@mui/material';
import {Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material';
import {styled} from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({theme}) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editField, setEditField] = useState('');
    const [editValue, setEditValue] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: ''});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/users/findall');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            showSnackbar('获取用户列表失败');
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}`);
            fetchUsers();
            showSnackbar('用户删除成功');
        } catch (err) {
            console.error('Error deleting user:', err);
            showSnackbar('删除用户失败');
        }
    };

    const openEditDialog = (user, field) => {
        setSelectedUser(user);
        setEditField(field);
        setEditValue(user[field] || '');
        setOpenDialog(true);
    };

    const handleEdit = async () => {
        try {
            const res = await axios.put(`/users/${selectedUser._id}`, {[editField]: editValue});
            setUsers(users.map(user => user._id === selectedUser._id ? res.data : user));
            setOpenDialog(false);
            showSnackbar('用户信息更新成功');
        } catch (err) {
            console.error('Error updating user:', err);
            showSnackbar(err.response?.data?.message || '更新用户信息失败');
        }
    };

    const showSnackbar = (message) => {
        setSnackbar({open: true, message});
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>用户管理</Typography>
            <List>
                {users.map((user) => (
                    <StyledListItem key={user._id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => openEditDialog(user, 'name')}>
                                <EditIcon/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteUser(user._id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </>
                    }>
                        <ListItemText
                            primary={user.name}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                        邮箱: {user.email}
                                    </Typography>
                                    <br/>
                                    <Button size="small" onClick={() => openEditDialog(user, 'email')}>更改邮箱</Button>
                                    <Button size="small"
                                            onClick={() => openEditDialog(user, 'password')}>更改密码</Button>
                                </>
                            }
                        />
                    </StyledListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>编辑用户{editField === 'name' ? '名' : editField === 'email' ? '邮箱' : '密码'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={editField === 'name' ? '用户名' : editField === 'email' ? '邮箱' : '新密码'}
                        type={editField === 'password' ? 'password' : 'text'}
                        fullWidth
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>取消</Button>
                    <Button onClick={handleEdit}>确认</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                message={snackbar.message}
            />
        </Container>
    );
};

export default UserManagement;