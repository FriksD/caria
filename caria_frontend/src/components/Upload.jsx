import React, {useEffect, useState} from "react";
import styled from "styled-components";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {X, Plus} from 'lucide-react';


const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({theme}) => theme.bgLighter};
  color: ${({theme}) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const CloseButton = styled.span`
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  line-height: initial;
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  line-height: initial;
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const TagInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px;
  border: 1px solid ${({theme}) => theme.soft};
  border-radius: 3px;
  background-color: transparent;
  min-height: 42px;
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  margin: 2px;
  padding: 3px 8px;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 12px;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({theme}) => theme.softHover || theme.soft};
  }
`;

const TagText = styled.span`
  margin-right: 5px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${({theme}) => theme.text};
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 50px;
  border: none;
  outline: none;
  padding: 5px;
  font-size: 14px;
  background-color: transparent;
  color: ${({theme}) => theme.text};

  &::placeholder {
    color: ${({theme}) => theme.textSoft};
    opacity: 0.7;
  }
`;

const AddTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 5px;

  &:hover {
    background-color: ${({theme}) => theme.softHover || theme.soft};
  }
`;

const TagInputComponent = ({tags, setTags}) => {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const addTag = () => {
        if (input.trim() && !tags.includes(input.trim())) {
            setTags([...tags, input.trim()]);
            setInput('');
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <TagInputContainer>
            {tags.map((tag, index) => (
                <Tag key={index}>
                    <TagText>{tag}</TagText>
                    <RemoveButton onClick={() => removeTag(index)}>
                        <X size={12}/>
                    </RemoveButton>
                </Tag>
            ))}
            <TagInput
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="输入标签并回车"
            />
            <AddTagButton onClick={addTag}>
                <Plus size={16}/>
            </AddTagButton>
        </TagInputContainer>
    );
};

const Upload = ({setOpen}) => {
    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => {
            return {...prev, [e.target.name]: e.target.value};
        });
    };

    useEffect(() => {
        // 禁止滚动
        document.body.style.overflow = 'hidden';

        // 组件卸载时恢复滚动
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("video", video);
        formData.append("img", img);
        formData.append("title", inputs.title);
        formData.append("desc", inputs.desc);
        formData.append("tags", tags.join(','));

        try {
            const res = await axios.post("/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            setOpen(false);
            res.status === 200 && navigate(`/video/${res.data._id}`);
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <>
            <Overlay onClick={() => setOpen(false)}/>
            <Container>
                <Wrapper>
                    <Close>
                        <CloseButton onClick={() => setOpen(false)}>x</CloseButton>
                    </Close>
                    <Title>上传新视频</Title>
                    <Label>视频文件:</Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                    <Input
                        type="text"
                        placeholder="视频标题"
                        name="title"
                        onChange={handleChange}
                    />
                    <Desc
                        placeholder="视频介绍"
                        name="desc"
                        rows={8}
                        onChange={handleChange}
                    />
                    <Label>标签:</Label>
                    <TagInputComponent tags={tags} setTags={setTags}/>
                    <Label>封面:</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImg(e.target.files[0])}
                    />
                    {uploadProgress > 0 && <div>上传进度: {uploadProgress}%</div>}
                    <Button onClick={handleUpload}>上传</Button>
                </Wrapper>
            </Container>
        </>
    );
};

export default Upload;