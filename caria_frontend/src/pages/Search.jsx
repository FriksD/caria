import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background-color: ${({ theme }) => theme.bg};
    transition: background-color 0.3s ease;
    &:hover {
        background-color: ${({ theme }) => theme.bgHover};
    }
`;

const Search = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = useLocation().search;

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/videos/search${query}`);
                setVideos(res.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch videos. Please try again.");
                console.error("Error fetching videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [query]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container>
            {videos.length === 0 ? (
                <div>No videos found. Try a different search term.</div>
            ) : (
                videos.map((video) => <Card key={video._id} video={video} />)
            )}
        </Container>
    );
};

export default Search;