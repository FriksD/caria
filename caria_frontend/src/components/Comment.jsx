import axios from "axios";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {format} from "timeago.js";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({theme}) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({comment}) => {

    const [user, setUser] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/find/${comment.userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [comment.userId])


    return (
        <Container>
            <Avatar
                src="https://yt3.ggpht.com/yti/APfAmoE-Q0ZLJ4vk3vqmV4Kwp0sbrjxLyB8Q4ZgNsiRH=s88-c-k-c0x00ffffff-no-rj-mo"/>
            <Details>
                <Name>
                    {user.name} <Date>{format(comment.createdAt, 'zh_CN')}</Date>
                </Name>
                <Text>
                    {comment.desc}
                </Text>
            </Details>
        </Container>
    );
};

export default Comment;
