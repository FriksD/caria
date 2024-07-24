import React, {useState} from 'react';
import axios from "axios";
import styled from 'styled-components';
import {loginFail, loginStart, loginSucceed} from "../redux/userSlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  background-color: ${({theme}) => theme.bg};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
`;

const LoginWrapper = styled.div`
  background-color: ${({theme}) => theme.bg};
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({theme}) => theme.bgHover};
  }
    width: 250px;
    height: 500px;
    padding: 0 50px;
    position: absolute;
    border-radius: 15px;
    transform: translate(-50%, -50%);
    border: 1px solid #D3D3D3;
  left: 56%;
  top: 50%;
  
`;

const Header = styled.div`
  
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    line-height: 150px;
  color: ${({theme}) => theme.textSoft};
`;

const FormWrapper = styled.form`
  .input-data {
    width: 100%;
    height: 40px;
    position: relative;
    padding: 0;
    margin: 30px 0;
  }

  .input-data input {
    width: 100%;
    height: 100%;
    border: none;
    font-size: 17px;
    color: ${({theme}) => theme.text};
  }

  .input-data input:focus ~ label,
  .input-data input:valid ~ label {
    transform: translateY(-20px);
    font-size: 15px;
  }

  .input-data input:focus ~ label{
    color: #4158d0;
  }

  .input-data input:focus {
    outline: none;
  }

  .input-data label {
    position: absolute;
    bottom: 10px;
    left: 0;
    color: grey;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .underline {
    position: absolute;
    bottom: 0px;
    height: 2px;
    width: 100%;
  }

  .underline:before {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    background: #4158d0;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  input:focus ~ .underline:before {
    transform: scaleX(1);
  }
  input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
  }
  input {
    background-color:transparent;
  }
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  text-align: center;
  justify-content: center;
  margin-left: 30%;
  width: 40%;
  background-color: ${({theme}) => theme.bgLighter};
  transition: background-color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: ${({theme}) => theme.bg.soft};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  };
  color:${({theme}) => theme.text};
`;

const Msg = styled.div`
  text-align: center;
  line-height: 120px;
color: ${({theme}) => theme.textSoft};
  a {
    text-decoration: none;
    color: #a6c1ee;
  }
`;

const Login = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const history = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.post("/auth/signin", {name, password});
            dispatch(loginSucceed(res.data)); // 传回登录数据
            alert("登录成功");
            history("/");
        } catch (err) {
            dispatch(loginFail());
        }
    }

    return (
        <Container>
            <LoginWrapper>
                <Header>登录</Header>
                <FormWrapper>
                    <div className="input-data">
                        <input type="text"
                               onChange={e => setName(e.target.value)}
                               required/>
                        <div className="underline"></div>
                        <label>用户名</label>
                    </div>
                    <div className="input-data">
                        <input type="password"
                               onChange={e => setPassword(e.target.value)}
                               required/>
                        <div className="underline"></div>
                        <label>密码</label>
                    </div>
                    <Button onClick={handleLogin}>登录</Button>
                </FormWrapper>
                <Msg>
                    没有帐户? <a href="/register">立即注册</a>
                </Msg>
            </LoginWrapper>
        </Container>
    );
}

export default Login;