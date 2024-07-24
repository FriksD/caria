import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginSucceed} from "../redux/userSlice";

const Container = styled.div`
    flex-direction: column;
    align-items: center;
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
    left: 56%;
    top: 50%;
    border-radius: 15px;
    transform: translate(-50%, -50%);
    border: 1px solid #D3D3D3;
    
`;

const Header = styled.div`
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    line-height: 100px;
`;

const FormWrapper = styled.form`
    .input-data {
        width: 100%;
        height: 40px;
        position: relative;
        padding: 0;
        margin: 20px 0;
    }

    .input-data input {
        width: 100%;
        height: 100%;
        border: none;
        font-size: 17px;
    }

    .input-data input:focus ~ label,
    .input-data input:valid ~ label {
        transform: translateY(-20px);
        font-size: 15px;
    }

    .input-data input:focus ~ label {
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

    input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s;
    }

    input {
        background-color: transparent;
    }

    

    .email-wrapper {
        display: flex;
        align-items: center;
    }

    .email-wrapper button {
        margin-left: 10px;
        padding: 5px 10px;
        font-size: 14px;
    }

    .email-wrapper input {
        width: 70%;
    }
    .email-wrapper .
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

const MailBtn = styled(Button)`
    width: 60%;
    height: 35px;
    align-items: center;
    margin-top: 0px;
`;


const Msg = styled.div`
    line-height: 0px;
    font-size: 13px;
    color: #ff0000;

    a {
        text-decoration: none;
    }
`;

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailVerify, setEmailVerify] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (password === passwordConfirm) {
                const res = await axios.post("/auth/signup", {name, email, password, verificationCode: emailVerify});
                alert("注册成功");
                dispatch(loginSucceed(res.data));
                navigate("/");
            } else {
                alert("两次输入的密码不一致");
            }
        } catch (err) {
            alert(err.response?.data?.message || "注册失败");
        }
    }

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        if (countdown > 0) return;
        try {
            await axios.post("/auth/sendCode", {email});
            setCountdown(60);
            alert("验证码已发送，请查看您的邮箱");
        } catch (err) {
            alert(err.response?.data?.message || "发送验证码失败");
        }
    }


    return (
        <Container>
            <LoginWrapper>
                <Header>注册</Header>
                <FormWrapper onSubmit={handleRegister}>
                    <div className="input-data">
                        <input type="text" name="username"
                               onChange={(e) => setName(e.target.value)}
                               required/>
                        <div className="underline"></div>
                        <label>用户名</label>
                    </div>
                    <Msg></Msg>
                    <div className="input-data">
                        <input type="password" name="password"
                               onChange={(e) => setPassword(e.target.value)}
                               required/>
                        <div className="underline"></div>
                        <label>密码</label>
                    </div>
                    <div className="input-data">
                        <input type="password" name="passwordconfirm"
                               onChange={(e) => setPasswordConfirm(e.target.value)}
                               required/>
                        <div className="underline"></div>
                        <label>确认密码</label>
                    </div>
                    <Msg></Msg>
                    <div className="input-data">
                        <input type="email" name="email"
                               onChange={(e) => setEmail(e.target.value)}
                               required/>
                        <div className="underline"></div>
                        <label>邮箱</label>
                    </div>
                    <Msg></Msg>
                    <div className="input-data email-wrapper">
                        <input
                            type="text"
                            name="verify"
                            className="input-data mail"
                            onChange={(e) => setEmailVerify(e.target.value)}
                            required
                        />
                        <MailBtn
                            onClick={handleSendVerificationCode}
                            disabled={countdown > 0}
                        >
                            {countdown > 0 ? `${countdown}s后重试` : '发送验证码'}
                        </MailBtn>
                        <div className="underlineformail"></div>
                        <label>验证码</label>
                    </div>
                    <Msg></Msg>

                    <Button onClick={handleRegister}>注册</Button>
                </FormWrapper>
            </LoginWrapper>
        </Container>
    );
}

export default Register;