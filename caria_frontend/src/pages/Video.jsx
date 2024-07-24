import React, {useEffect, useState} from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import axios from "axios";
import {dislike, fetchSucceed, like} from "../redux/videoSlice.js";
import {format} from "timeago.js";
import {PersonAddOutlined, ThumbDown, ThumbDownOutlined, ThumbUp} from "@mui/icons-material";
import {subscription} from "../redux/userSlice.js";
import VideoPlayer from "../components/VideoPlayer";

const Container = styled.div`
    display: flex;
    gap: 24px;
`;

const Content = styled.div`
    flex: 5;
`;
const VideoWrapper = styled.div`

`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: 400;
    margin-top: 20px;
    margin-bottom: 10px;
    color: ${({theme}) => theme.text};
`;

const Details = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Info = styled.span`
    color: ${({theme}) => theme.textSoft};
`;

const Buttons = styled.div`
    display: flex;
    gap: 20px;
    color: ${({theme}) => theme.text};
`;

const Button = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
`;

const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({theme}) => theme.soft};
`;

const Recommendation = styled.div`
    flex: 2;
`;
const Channel = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ChannelInfo = styled.div`
    display: flex;
    gap: 20px;
`;

const Image = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const ChannelDetail = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({theme}) => theme.text};
`;

const ChannelName = styled.span`
    font-weight: 500;
`;

const ChannelCounter = styled.span`
    margin-top: 5px;
    margin-bottom: 20px;
    color: ${({theme}) => theme.textSoft};
    font-size: 12px;
`;

const Description = styled.p`
    font-size: 14px;
`;

const Subscribe = styled.button`
    padding: 10px 16px;
    background-color: ${({theme, primary}) => (primary ? theme.primary : theme.bgLighter)};
    color: ${({theme, primary}) => (primary ? theme.bg : theme.text)};
    border: none;
    border-radius: 24px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 60px;
    margin-top: 10px;
    gap: 8px;
    transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s;

    &:hover {
        background-color: ${({theme, primary}) => (primary ? theme.primaryHover : theme.bgHover)};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }
`;

const Video = () => {

    const currentUser = useSelector(state => state.user).currentUser;
    const currentVideo = useSelector(state => state.video).currentVideo;

    const dispatch = useDispatch();

    const path = useLocation().pathname.split("/")[2];

    const [channel, setChannel] = useState({});
    const [viewAdded, setViewAdded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axios.get(`/videos/find/${path}`);
                const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
                setChannel(channelRes.data);
                dispatch(fetchSucceed(videoRes.data));
            } catch (err) {
            }
        }
        fetchData();
    }, [path, dispatch])

    const handleLike = async () => {
        if (!currentUser) {
            // 用户未登录，提示用户登录并跳转到登录页面
            alert("请先登录以点赞视频");
            // 跳转到登录页面
            window.location.href = "/signin"; // 替换为你的登录页面路径
            return;
        }

        // 处理点赞逻辑
        await axios.put(`/users/like/${currentVideo._id}`);
        dispatch(like(currentUser._id));
    }

    const handleDisLike = async () => {

        if (!currentUser) {
            // 用户未登录，提示用户登录并跳转到登录页面
            alert("请先登录以踩视频");
            // 跳转到登录页面
            window.location.href = "/signin"; // 替换为你的登录页面路径
            return;
        }

        await axios.put(`/users/dislike/${currentVideo._id}`);
        dispatch(dislike(currentUser._id));
    }

    const handleSub = async () => {

        if (!currentUser) {
            // 用户未登录，提示用户登录并跳转到登录页面
            alert("请先登录以关注");
            // 跳转到登录页面
            window.location.href = "/signin"; // 替换为你的登录页面路径
            return;
        }

        currentUser.subscribedUsers.includes(channel._id)
            ? await axios.put(`/users/unsub/${channel._id}`)
            : await axios.put(`/users/sub/${channel._id}`);
        dispatch(subscription(channel._id));
    };


    function numConvert(num) {
        if (num >= 10000) {
            num = Math.round(num / 1000) / 10 + 'W';
        } else if (num >= 1000) {
            num = Math.round(num / 100) / 10 + 'K';
        }
        return num;
    }


    useEffect(() => {
        const addView = async () => {
            try {
                if (currentVideo && !viewAdded) {
                    await axios.put(`/videos/view/${currentVideo._id}`);
                    setViewAdded(true);
                    // 更新 Redux store 中的播放量
                    dispatch(fetchSucceed({...currentVideo, views: currentVideo.views + 1}));
                }
            } catch (err) {
                console.error("Error adding view:", err);
            }
        };
        addView();
    }, [currentVideo, viewAdded, dispatch]);

    return (
        <Container>
            <Content>
                <VideoWrapper>
                    <VideoPlayer src={currentVideo.videoUrl}/>
                </VideoWrapper>
                <Title>{currentVideo.title}</Title>
                <Details>
                    <Info>{numConvert(currentVideo.views)} 观看 • {format(currentVideo.createdAt, 'zh_CN')}</Info>
                    <Buttons>
                        <Button onClick={handleLike}>
                            {currentVideo.likes?.includes(currentUser?._id) ? <ThumbUp/> :
                                <ThumbUpOutlinedIcon/>} {currentVideo.likes?.length}
                        </Button>
                        <Button onClick={handleDisLike}>
                            {currentVideo.dislikes?.includes(currentUser?._id) ? <ThumbDown/> : <ThumbDownOutlined/>} 踩
                        </Button>
                        <Button>
                            <ReplyOutlinedIcon/> 分享
                        </Button>
                        <Button>
                            <AddTaskOutlinedIcon/> 保存
                        </Button>
                    </Buttons>
                </Details>
                <Hr/>
                <Channel>
                    <ChannelInfo>
                        <Image src={channel.img}/>
                        <ChannelDetail>
                            <ChannelName>{channel.name}</ChannelName>
                            <ChannelCounter>{numConvert(channel.subscribers)} 粉丝</ChannelCounter>
                            <Description>
                                {currentVideo.desc}
                            </Description>
                        </ChannelDetail>
                    </ChannelInfo>
                    <Subscribe onClick={handleSub}>
                        <PersonAddOutlined/>
                        {currentUser?.subscribedUsers?.includes(channel._id) ? "已关注" : "关注"}</Subscribe>
                </Channel>
                <Hr/>
                <Comments videoId={currentVideo._id}/>
            </Content>
            <Recommendation>

            </Recommendation>
        </Container>
    );
};

export default Video;
