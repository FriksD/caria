import React, {useState} from "react";
import {useSelector} from "react-redux";
import styled, {ThemeProvider} from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import {darkTheme, lightTheme} from "./utils/Theme";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Register from "./pages/Register";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import VideoManagement from "./components/VideoManagement";
import UserProfile from "./pages/UserProfile";
import ErrorPage from "./pages/ErrorPage";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({theme}) => theme.bg};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
`;

const Wrapper = styled.div`
  padding: 22px 96px;
`;


function App() {
    const [darkMode, setDarkMode] = useState(true);
    const {currentAdmin} = useSelector((state) => state.admin);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <BrowserRouter>
                <Routes>
                    {/* 后台 */}
                    <Route
                        path="/admin"
                        element={currentAdmin ? <Navigate to="/admin/dashboard"/> : <Navigate to="/admin/login"/>}
                    />
                    <Route path="/admin/dashboard"
                           element={currentAdmin ? <AdminDashboard/> : <Navigate to="/admin/login"/>}/>
                    <Route path="/admin/users"
                           element={currentAdmin ? <UserManagement/> : <Navigate to="/admin/login"/>}/>
                    <Route path="/admin/videos"
                           element={currentAdmin ? <VideoManagement/> : <Navigate to="/admin/login"/>}/>
                    <Route path="/admin/login" element={<AdminLogin/>}/>

                    {/* 用户界面 */}
                    <Route
                        path="*"
                        element={
                            <Container>
                                <Menu darkMode={darkMode} setDarkMode={setDarkMode}/>
                                <Main>
                                    <Navbar/>
                                    <Wrapper>
                                        <Routes>
                                            <Route index element={<Home type="random"/>}/>
                                            <Route path="trend" element={<Home type="trend"/>}/>
                                            <Route path="sub" element={<Home type="sub"/>}/>
                                            <Route path="all" element={<Home type="findAll"/>}/>
                                            <Route path="history" element={<Home type="history"/>}/>
                                            <Route path="search" element={<Search/>}/>
                                            <Route path="signin" element={<SignIn/>}/>
                                            <Route path="register" element={<Register/>}/>
                                            <Route path="video/:id" element={<Video/>}/>
                                            <Route path="user/:id" element={<UserProfile/>}/>
                                            <Route path="error" element={<ErrorPage/>}/>
                                        </Routes>
                                    </Wrapper>
                                </Main>
                            </Container>
                        }
                    />
                </Routes>

            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;