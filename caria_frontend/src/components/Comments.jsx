import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Comment from "./Comment";
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const CommentUpload = styled.div`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${({theme}) => theme.bg};
  color: ${({theme}) => theme.text};
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width:50px;
  &:hover {
    background-color: ${({theme}) => theme.bgLighter};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const Comments = ({videoId}) => {
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState({});

    const handleCommentUpload = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/comments/", {videoId: videoId, desc: comment})
            window.location.reload();
        } catch (err) {
            alert("请先登录以评论");
            navigate("/signin");
        }
    }

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/comments/${videoId}`);
                setComments(res.data);
            } catch (err) {
            }
        };
        fetchComments();
    }, [videoId])

    return (
        <Container>
            <NewComment>
                <Avatar src="https://gd-hbimg.huaban.com/fdc6182522dccb56f8dc4f2eb8829638aa22e29c164b-0UyDlb_fw236"/>
                <Input placeholder="添加一条评论..." onChange={handleComment}/>
                <CommentUpload onClick={handleCommentUpload}>评论</CommentUpload>
            </NewComment>

            {comments.map((comment) => (<Comment key="comment._id" comment={comment}/>))}
        </Container>
    );
};

export default Comments;
