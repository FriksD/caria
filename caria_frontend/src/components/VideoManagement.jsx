import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Container, Typography, List, ListItem, ListItemText,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Snackbar, IconButton, Card, CardContent, CardActions
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

const VideoManagement = () => {
    const [videos, setVideos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [editField, setEditField] = useState('');
    const [editValue, setEditValue] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: ''});

    useEffect(() => {

        fetchVideos();
    }, []);
    const fetchVideos = async () => {
        try {
            const res = await axios.get('/videos/findall');
            setVideos(res.data);
        } catch (err) {
            console.error('Error fetching videos:', err);
            showSnackbar('获取视频列表失败');
        }
    };


    const deleteVideo = async (videoId) => {
        try {
            await axios.delete(`/videos/${videoId}`);
            fetchVideos();
            showSnackbar('视频删除成功');
        } catch (err) {
            console.error('Error deleting video:', err);
            showSnackbar('删除视频失败');
        }
    };

    const openEditDialog = (video, field) => {
        setSelectedVideo(video);
        setEditField(field);
        setEditValue(video[field] || '');
        setOpenDialog(true);
    };

    const handleEdit = async () => {
        try {
            const res = await axios.put(`/videos/${selectedVideo._id}`, {[editField]: editValue});
            setVideos(videos.map(video => video._id === selectedVideo._id ? res.data : video));
            setOpenDialog(false);
            showSnackbar('视频信息更新成功');
        } catch (err) {
            console.error('Error updating video:', err);
            showSnackbar(err.response?.data?.message || '更新视频信息失败');
        }
    };

    const showSnackbar = (message) => {
        setSnackbar({open: true, message});
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>视频管理</Typography>
            <List>
                {videos.map((video) => (
                    <StyledListItem key={video._id}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {video.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {video.desc}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => openEditDialog(video, 'title')}>更改标题</Button>
                            <Button size="small" onClick={() => openEditDialog(video, 'desc')}>更改简介</Button>
                            <IconButton aria-label="delete" onClick={() => deleteVideo(video._id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </CardActions>
                    </StyledListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>编辑视频{editField === 'title' ? '标题' : '简介'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={editField === 'title' ? '标题' : '简介'}
                        type="text"
                        fullWidth
                        multiline={editField === 'desc'}
                        rows={editField === 'desc' ? 4 : 1}
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

export default VideoManagement;