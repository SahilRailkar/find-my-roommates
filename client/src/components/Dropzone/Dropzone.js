import axios from "axios";

import React, { useContext } from "react";
import { useDropzone } from "react-dropzone";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { useMutation } from "@apollo/client";

import Button from "@mui/material/Button";

import { ModalContext } from "../../contexts/ModalContext";
import { ADD_USER_IMAGES, GET_SIGNED_URLS } from "../../graphql/mutations";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Dropzone = ({ refetchUser }) => {
  const { hideModal } = useContext(ModalContext);
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: "image/*" });
  const history = useHistory();

  const uploadToS3 = async (file, signedUrl) => {
    const options = {
      headers: {
        "Content-Type": file.type,
      },
    };
    await axios.put(signedUrl, file, options);
  };

  const [addUserImages] = useMutation(ADD_USER_IMAGES, {
    onCompleted: () => {
      refetchUser();
    },
  });
  const [getSignedUrls] = useMutation(GET_SIGNED_URLS, {
    onCompleted: async (data) => {
      const signedUrls = data.getSignedUrls;
      for (let i = 0; i < signedUrls.length; ++i) {
        const file = acceptedFiles[i];
        const { signedUrl } = signedUrls[i];
        await uploadToS3(file, signedUrl);
      }
      const urls = signedUrls.map(({ url }) => {
        return url;
      });
      addUserImages({
        variables: {
          urls,
        },
      });
    },
  });

  const createKey = (filename) => {
    const date = new Date().valueOf();
    const cleanFilename = filename.replace(/[^0-9a-zA-Z/!-_.*'()]/g, "-");
    const splitFilename = cleanFilename.split(".");
    const newFilename = `images/${splitFilename[0]}_${date}.${splitFilename[1]}`;
    return newFilename.substring(0, 1024);
  };

  const handleClickUploadButton = async () => {
    getSignedUrls({
      variables: {
        files: acceptedFiles.map((file) => {
          return {
            key: createKey(file.name),
            contentType: file.type,
          };
        }),
      },
    });
    hideModal();
    history.push("/profile");
  };

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some images here, or click to select images</p>
      </Container>
      <div>
        {files.length !== 0 && <h4>Images</h4>}
        <ul>{files}</ul>
      </div>
      <Button
        onClick={handleClickUploadButton}
        size="large"
        sx={{ width: "100%" }}
        variant="contained"
      >
        Upload
      </Button>
    </div>
  );
};

export default Dropzone;
