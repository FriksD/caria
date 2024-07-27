import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: ${({theme}) => theme.bg};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
`;

const Home = ({type}) => {
    const [videos, setVideos] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/${type}`);
            if (!res){
                alert("用户未登录！");
                history("/login");
            }
            setVideos(res.data);
        };
        fetchVideos();
    }, [type]);

    return (
        <Container>
            {videos.map((video) => (
                <Card key={video._id} video={video}/>
            ))}
        </Container>
    );
};

export default Home;