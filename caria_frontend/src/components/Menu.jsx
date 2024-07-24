import React from "react";
import styled from "styled-components";
import LamaTube from "../img/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const Container = styled.div`
  flex: 1;
  background-color: ${({theme}) => theme.bg};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
  height: 100vh;
  color: ${({theme}) => theme.text};
  font-size: 14px;
  position: sticky;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow: auto;
    
  ::-webkit-scrollbar {

    display: none

  }
`;

const Wrapper = styled.div`
  padding: 18px 26px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
    justify-content: center;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Img = styled.img`
  height: 35px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({theme}) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 1px 0;
  border: 0.5px solid ${({theme}) => theme.soft};
  
`;

const Login = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 24px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({theme}) => theme.bgLighter};
  transition: background-color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: ${({theme}) => theme.bg.soft};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  };
  color:${({theme}) => theme.text};
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({darkMode, setDarkMode}) => {
    const {currentUser} = useSelector((state) => state.user);

    return (
        <Container>
            <Wrapper>
                <Link to="/" style={{textDecoration: "none", color: "inherit"}}>
                    <Logo>
                        <Img src={LamaTube}/>
                    </Logo>
                </Link>
                <Link to="" style={{textDecoration: "none", color: "inherit"}}>
                    <Item>
                        <HomeIcon/>
                        主页
                    </Item>
                </Link>
                <Link to="trend" style={{textDecoration: "none", color: "inherit"}}>
                    <Item>
                        <ExploreOutlinedIcon/>
                        热门
                    </Item>
                </Link>
                <Link to="sub" style={{textDecoration: "none", color: "inherit"}}>
                    <Item>
                        <SubscriptionsOutlinedIcon/>
                        订阅
                    </Item>
                </Link>
                <Hr/>
                <Link to="all" style={{textDecoration: "none", color: "inherit"}}>
                    <Item>
                        <VideoLibraryOutlinedIcon/>
                        视频库
                    </Item>
                </Link>
                <Item>
                    <HistoryOutlinedIcon/>
                    历史记录
                </Item>
                <Hr/>
                {!currentUser && (
                    <>
                        <Login>
                            <Link to="signin" style={{textDecoration: "none", color: "inherit"}}>
                                <Button>
                                    <AccountCircleOutlinedIcon/>
                                    登录
                                </Button>
                            </Link>
                        </Login>
                        <Hr/>
                    </>
                )}
                <Title>分类</Title>
                <Item>
                    <LibraryMusicOutlinedIcon/>
                    音乐
                </Item>
                <Item>
                    <SportsBasketballOutlinedIcon/>
                    体育
                </Item>
                <Item>
                    <SportsEsportsOutlinedIcon/>
                    游戏
                </Item>
                <Item>
                    <MovieOutlinedIcon/>
                    电影
                </Item>
                <Item>
                    <ArticleOutlinedIcon/>
                    新闻
                </Item>
                <Item>
                    <LiveTvOutlinedIcon/>
                    直播
                </Item>
                <Hr/>
                <Item>
                    <SettingsOutlinedIcon/>
                    设置
                </Item>
                <Item>
                    <FlagOutlinedIcon/>
                    举报
                </Item>
                <Item>
                    <HelpOutlineOutlinedIcon/>
                    帮助
                </Item>
                <Item onClick={() => setDarkMode(!darkMode)}>
                    <SettingsBrightnessOutlinedIcon/>
                    {darkMode ? "浅色" : "深色"}模式
                </Item>
            </Wrapper>
        </Container>
    );
};

export default Menu;