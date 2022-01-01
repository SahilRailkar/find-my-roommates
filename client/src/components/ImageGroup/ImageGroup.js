import React, { useContext, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import styled from "styled-components";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { ModalContext } from "../../contexts/ModalContext";
import UploadImageModal from "../../modals/UploadImageModal/UploadImageModal";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CenteredDiv = styled.div`
  display: inline-block;
  height: 300px;
  width: 500px;
  position: relative;
`;

const StyledImg = styled.img`
  border-radius: 15px;
  object-fit: cover;
  position: absolute;
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const LeftIconButton = styled(IconButton)`
  left: 10%;
  position: absolute;
  top: calc(50% - 10px);
  height: 20px;
`;

const RightIconButton = styled(IconButton)`
  right: 10%;
  position: absolute;
  top: calc(50% - 10px);
  height: 20px;
`;

const ImageGroup = ({ images, refetchUser }) => {
  const { showModal } = useContext(ModalContext);

  const [focus, setFocus] = useState(0);

  const [inProps, setInProps] = useState([]);
  useEffect(() => {
    const NUM_IMAGES = images ? images.length : 0;
    const inPropsInit = [];
    for (let i = 0; i < NUM_IMAGES; ++i) {
      inPropsInit.push(i === 0 ? true : false);
    }
    setInProps(inPropsInit);
  }, [images]);

  const duration = 300;

  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
  };

  const transitionStyles = {
    entering: {
      height: "300px",
      left: "calc(50% - 100px)",
      opacity: 1,
      width: "200px",
      zIndex: 1,
    },
    entered: {
      height: "300px",
      left: "calc(50% - 100px)",
      opacity: 1,
      width: "200px",
      zIndex: 1,
    },
    exiting: {
      height: "285px",
      left: "calc(40% - 100px)",
      opacity: focus === 1 ? 0.5 : 0,
      width: "190px",
      zIndex: 0,
    },
    exited: {
      height: "285px",
      left: "calc(40% - 100px)",
      opacity: focus === 1 ? 0.5 : 0,
      width: "190px",
      zIndex: 0,
    },
  };

  const handleClickLeftIconButton = () => {
    const newInProps = inProps.slice();
    newInProps[focus] = false;
    newInProps[focus - 1] = true;
    setInProps(newInProps);
    setFocus(focus - 1);
  };

  const handleClickRightIconButton = () => {
    const newInProps = inProps.slice();
    newInProps[focus] = false;
    newInProps[focus + 1] = true;
    setInProps(newInProps);
    setFocus(focus + 1);
  };

  return (
    <Container>
      <CenteredDiv>
        <LeftIconButton
          color="secondary"
          disabled={focus === 0}
          onClick={handleClickLeftIconButton}
        >
          <ArrowBackIcon />
        </LeftIconButton>
        {inProps.length >= 1 ? (
          <Transition in={inProps[0]} timeout={duration}>
            {(state) => {
              return (
                <StyledImg
                  style={{ ...defaultStyle, ...transitionStyles[state] }}
                  src={images[0]}
                ></StyledImg>
              );
            }}
          </Transition>
        ) : (
          <Box
            onClick={() => {
              showModal(UploadImageModal, {
                isOpen: true,
                refetchUser,
              });
            }}
            sx={{
              alignItems: "center",
              border: "1px dashed #ffffff",
              borderRadius: "15px",
              display: "flex",
              height: "300px",
              justifyContent: "center",
              left: "calc(50% - 100px)",
              position: "absolute",
              width: "200px",
            }}
          >
            <Typography p={2}>Add pictures of yourself!</Typography>
          </Box>
        )}
        {inProps.length > 1
          ? inProps.map((inProp, index) => {
              if (index !== 0) {
                return (
                  <Transition key={index} in={inProp} timeout={duration}>
                    {(state) => {
                      const rightTransitionStyles = {
                        ...transitionStyles,
                        exiting: {
                          height: "285px",
                          [index < focus ? "left" : "right"]:
                            "calc(40% - 100px)",
                          opacity:
                            focus - 1 === index || focus + 1 === index
                              ? 0.5
                              : 0,
                          width: "190px",
                          zIndex: 0,
                        },
                        exited: {
                          height: "285px",
                          [index < focus ? "left" : "right"]:
                            "calc(40% - 100px)",
                          opacity:
                            focus - 1 === index || focus + 1 === index
                              ? 0.5
                              : 0,
                          width: "190px",
                          zIndex: 0,
                        },
                      };

                      return (
                        <StyledImg
                          style={{
                            ...defaultStyle,
                            ...rightTransitionStyles[state],
                          }}
                          src={images[index]}
                        ></StyledImg>
                      );
                    }}
                  </Transition>
                );
              }
              return null;
            })
          : null}
        <RightIconButton
          color="secondary"
          disabled={inProps.length === 0 || focus === inProps.length - 1}
          onClick={handleClickRightIconButton}
        >
          <ArrowForwardIcon />
        </RightIconButton>
      </CenteredDiv>
    </Container>
  );
};

export default ImageGroup;
