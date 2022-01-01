import React, { useContext } from "react";
import styled from "styled-components";

import Button from "@mui/material/Button";
import ArrowForward from "@mui/icons-material/ArrowForward";

import apartment from "./apartment.jpeg";

import { ModalContext } from "../../contexts/ModalContext";
import SignUpModal from "../../modals/SignUpModal/SignUpModal";

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  color: white;
  left: 10%;
  padding: 25px;
  position: absolute;
  top: 10%;
  width: 40%;
  @media (max-width: 870px) {
    width: 60%;
  }
  @media (max-width: 610px) {
    right: 10%;
    width: unset;
  }
`;

const Description = styled.div`
  font-size: 20px;
  margin-bottom: 32px;
  @media (max-width: 1180px) {
    font-size: 18px;
  }
  @media (max-width: 990px) {
    font-size: 16px;
  }
`;

const RelativeDiv = styled.div`
  position: relative;
`;

const Title = styled.div`
  font-size: 76px;
  margin-bottom: 32px;
  @media (max-width: 1180px) {
    font-size: 64px;
  }
  @media (max-width: 990px) {
    font-size: 56px;
  }
`;

const StyledImage = styled.img`
  min-height: 100vh;
  max-height: 100vh;
  object-fit: cover;
`;

function Home() {
  const { component: Component, props, showModal } = useContext(ModalContext);

  return (
    <RelativeDiv>
      <StyledImage src={apartment} width="100%" />
      <Container>
        <Title>Living spaces made for students</Title>
        <Description>
          Students around the nation use Rümer to find living spaces, roommates,
          and furniture.
        </Description>
        <Button
          color="secondary"
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => showModal(SignUpModal, { isOpen: true })}
        >
          Sign up
        </Button>
        {Component ? <Component {...props} /> : null}
      </Container>
    </RelativeDiv>
  );
}

export default Home;
