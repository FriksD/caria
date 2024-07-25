import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {format} from "timeago.js";
import axios from "axios";

const Container = styled.div`
  width: ${(props) => (props.type !== "sm" ? "360px" : "100%")};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  display: ${(props) => props.type === "sm" && "flex"};
  margin-left: 30px;
  gap: 10px;
  background-color: ${({theme}) => theme.bg};
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
  
`;

const ImageWrapper = styled(Link)`
  display: block;
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
  border-radius: 15px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
  align-items: flex-start;
`;

const ChannelImageWrapper = styled(Link)`
  display: ${(props) => props.type === "sm" && "none"};
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
`;

const Texts = styled.div`
  flex: 1;
`;

const TitleWrapper = styled(Link)`
  text-decoration: none;
  color: ${({theme}) => theme.text};
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

const ChannelNameWrapper = styled(Link)`
  text-decoration: none;
  color: ${({theme}) => theme.textSoft};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({theme}) => theme.textSoft};
`;

const Card = ({type, video}) => {
    const [channel, setChannels] = useState({});
    const history = useNavigate();

    useEffect(() => {
        const fetchChannel = async () => {
            const res = await axios.get(`/users/find/${video.userId}`);
            setChannels(res.data);
        };
        fetchChannel();
    }, [video.userId]);

    const numConvert = (num) => {
        if (num >= 10000) {
            num = Math.round(num / 1000) / 10 + "W";
        } else if (num >= 1000) {
            num = Math.round(num / 100) / 10 + "K";
        }
        return num;
    };

    const NavigateTo = async () => {
        await axios.put(`/videos/view/${video._id}`);
        await axios.put(`/users/history/${video._id}`);
        history(`/video/${video._id}`);
    }

    return (
        <Container type={type}>
            <ImageWrapper onClick={NavigateTo} type={type}>
                <Image src={video.imgUrl}/>
            </ImageWrapper>
            <Details type={type}>
                <ChannelImageWrapper to={`/user/${video.userId}`} type={type}>
                    <ChannelImage src={channel.img}/>
                </ChannelImageWrapper>
                <Texts>
                    <TitleWrapper onClick={NavigateTo}>
                        <Title>{video.title}</Title>
                    </TitleWrapper>
                    <ChannelNameWrapper to={`/user/${video.userId}`}>
                        <ChannelName>{channel.name}</ChannelName>
                    </ChannelNameWrapper>
                    <Info>
                        {numConvert(video.views)} 观看 • {format(video.createdAt, "zh_CN")}
                    </Info>
                </Texts>
            </Details>
        </Container>
    );
};

export default Card;