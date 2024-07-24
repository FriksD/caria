import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

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

const Search = () => {
    const [videos, setVideos] = useState([]);
    const query = useLocation().search;
    console.log(query);
    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`/videos/search${query}`);
            setVideos(res.data);
        };
        fetchVideos();
    }, [query]);

    return <Container>
        {videos.map(video => (
            <Card key={video._id} video={video}/>
        ))}
    </Container>;
};

export default Search;
