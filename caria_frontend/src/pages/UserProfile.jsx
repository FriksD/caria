import React, {useState, useEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import {useParams} from "react-router-dom";
import Card from "../components/Card";
import {PersonAddOutlined, Videocam, ThumbUp} from "@mui/icons-material";
import {subscription} from "../redux/userSlice";
import {useDispatch, useSelector} from "react-redux";

const Container = styled.div`
    padding: 22px 96px;
    background-color: ${({theme}) => theme.bg};
    color: ${({theme}) => theme.text};
    transition: background-color 0.3s ease;
`;

const Banner = styled.div`
    height: 300px;
    background-color: ${({theme}) => theme.bg};
    position: relative;
    margin-bottom: 100px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const UserInfoWrapper = styled.div`
    position: absolute;
    bottom: 40px;
    left: 50px;
    display: flex;
    align-items: center;
    background-color: ${({theme}) => theme.bg};
    padding: 20px;
    border-radius: 12px;

`;

const ChannelImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid ${({theme}) => theme.primary};
    margin-right: 30px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ChannelName = styled.h2`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 10px;
    color: ${({theme}) => theme.text};
`;

const SubscriberCount = styled.span`
    font-size: 18px;
    color: ${({theme}) => theme.textSoft};
    display: flex;
    align-items: center;
    gap: 5px;
`;

const ActionButtons = styled.div`
    position: absolute;
    right: 50px;
    bottom: 20px;
    display: flex;
    gap: 12px;
`;

const Button = styled.button`
    padding: 12px 24px;
    background-color: ${({theme, primary}) => (primary ? theme.primary : theme.bgLighter)};
    color: ${({theme, primary}) => (primary ? theme.bg : theme.text)};
    border: none;
    border-radius: 30px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({theme, primary}) => (primary ? theme.primaryHover : theme.bgHover)};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }
`;

const Content = styled.div`
    display: flex;
    gap: 24px;
`;

const VideoSection = styled.div`
    flex: 1;
`;

const SectionTitle = styled.h3`
    font-size: 24px;
    font-weight: 600;
    color: ${({theme}) => theme.text};
    margin-top: 30px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid ${({theme}) => theme.soft};
    display: flex;
    align-items: center;
    gap: 10px;
`;

const VideoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
`;

const cardVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0}
};

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [likedVideos, setLikedVideos] = useState([]);
    const [userVideos, setUserVideos] = useState([]);
    const {id} = useParams();
    const currentUser = useSelector(state => state.user).currentUser;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/find/${id}`);
            setUser(res.data);
        };

        const fetchLikedVideos = async () => {
            const res = await axios.get(`/videos/liked/${id}`);
            setLikedVideos(res.data);
        };

        const fetchUserVideos = async () => {
            const res = await axios.get(`/videos/user/${id}`);
            setUserVideos(res.data);
        };

        fetchUser();
        fetchLikedVideos();
        fetchUserVideos();
    }, [id]);

    if (!user) {
        return <div>加载中...</div>;
    }

    const handleSub = async () => {
        if (!currentUser) {
            alert("请先登录以关注");
            window.location.href = "/signin";
            return;
        }

        currentUser.subscribedUsers.includes(id)
            ? await axios.put(`/users/unsub/${id}`)
            : await axios.put(`/users/sub/${id}`);
        dispatch(subscription(id));
    };

    return (
        <Container>
            <Banner>
                <UserInfoWrapper>
                    <ChannelImage src={user.img}/>
                    <UserInfo>
                        <ChannelName>{user.name}</ChannelName>
                        <SubscriberCount>
                            <PersonAddOutlined/> {user.subscribers} 粉丝
                        </SubscriberCount>
                    </UserInfo>
                </UserInfoWrapper>
                <ActionButtons>
                    <Button onClick={handleSub}>
                        <PersonAddOutlined/>
                        {currentUser?.subscribedUsers?.includes(id) ? "已关注" : "关注"}
                    </Button>
                </ActionButtons>
            </Banner>
            <Content>
                <VideoSection>
                    <SectionTitle>
                        <Videocam/> 上传的视频
                    </SectionTitle>
                    <VideoGrid>
                        {userVideos.map((video, index) => (
                            <Card
                                key={video._id}
                                video={video}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{duration: 0.5, delay: index * 0.1}}
                            />
                        ))}
                    </VideoGrid>
                    <SectionTitle>
                        <ThumbUp/> 最近点赞的视频
                    </SectionTitle>
                    <VideoGrid>
                        {likedVideos.map((video, index) => (
                            <Card
                                key={video._id}
                                video={video}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{duration: 0.5, delay: index * 0.1}}
                            />
                        ))}
                    </VideoGrid>
                </VideoSection>
            </Content>
        </Container>
    );
};

export default UserProfile;