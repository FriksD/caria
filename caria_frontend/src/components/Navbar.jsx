import React, {useState, useRef, useEffect} from "react";
import styled, {keyframes, css} from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {VideoCallOutlined} from "@mui/icons-material";
import {loginOut} from "../redux/userSlice";
import {useDispatch} from "react-redux";
import Upload from "./Upload";

const Container = styled.nav`
  position: sticky;
  top: 0;
  background-color: ${({theme}) => theme.bg};
  height: 64px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
`;

const Search = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid ${({theme}) => theme.border};
  border-radius: 24px;
  background-color: ${({theme}) => theme.bgDark};
  color: ${({theme}) => theme.text};
  transition: box-shadow 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px ${({theme}) => theme.primary};
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({theme}) => theme.text};
  flex: 1;
  padding: 4px 8px;
  font-size: 16px;
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

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
  position: relative;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({theme}) => theme.avatar};
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
`;

const fadeInOut = css`
  ${({showMenu}) => (showMenu ? fadeInAnimation : fadeOutAnimation)} 0.2s
  ease-in-out;
`;

const Menu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  background-color: ${({theme}) => theme.bgLighter};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${fadeInOut};
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: ${({theme}) => theme.text};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({theme}) => theme.bgDark};
  }
`;

const VideoCallOutlinedButton = styled.div`
  cursor: pointer;
  color: ${({theme}) => theme.text};
  transition: color 0.3s ease;

  &:hover {
    color: ${({theme}) => theme.primary};
  }
`;

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const {currentUser} = useSelector((state) => state.user);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const history = useNavigate();
    const [q, setQ] = useState("");

    const handleAvatarClick = () => {
        setShowMenu(!showMenu);
    };
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(loginOut());
    };

    const handleProfile = () => {
        history(`/user/${currentUser._id}`);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();

    return (
        <>
            <Container>
                <Search>
                    <Input
                        placeholder="搜索..."
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)}/>
                </Search>

                {currentUser ? (
                    <User>
                        <VideoCallOutlinedButton onClick={() => setOpen(true)}>
                            <VideoCallOutlined/>
                        </VideoCallOutlinedButton>

                        <Avatar
                            src={currentUser.avatar}
                            onClick={handleAvatarClick}
                        />
                        {currentUser.name}
                        {showMenu && (
                            <Menu ref={menuRef} showMenu={showMenu}>
                                <MenuItem onClick={handleProfile}>个人主页</MenuItem>
                                <MenuItem onClick={handleLogout}>登出账户</MenuItem>
                            </Menu>
                        )}
                    </User>
                ) : (
                    <Link to="signin" style={{textDecoration: "none"}}>
                        <Button>
                            <AccountCircleOutlinedIcon/>
                            登录
                        </Button>
                    </Link>
                )}
            </Container>
            {open && <Upload setOpen={setOpen}/>}
        </>
    );
};

export default Navbar;