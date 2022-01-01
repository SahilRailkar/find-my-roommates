import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { useQuery } from "@apollo/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import "./Profile.css";
import ImageGroup from "../../components/ImageGroup/ImageGroup";
import { ModalContext } from "../../contexts/ModalContext";
import { GET_USER } from "../../graphql/queries";
import UploadImageModal from "../../modals/UploadImageModal/UploadImageModal";

const TopContainer = styled(Container)`
  color: white;
  padding-top: 32px;
  text-align: center;
`;

const BottomContainer = styled(Container)`
  border-radius: 16px;
  background-color: #181818;
  color: white;
  font
  margin-top: 32px;
  min-height: 100vh;
  padding: 32px;
  position: relative;
`;

const StyledTextField = styled(TextField)`
  color: #ffffff !important;
`;

const calculateAge = (birthday) => {
  const dob = new Date(birthday);
  const diff = Date.now() - dob.getTime();
  const delta = new Date(diff);
  return Math.abs(delta.getUTCFullYear() - 1970);
};

const years = [
  {
    value: "freshman",
    label: "freshman",
  },
  {
    value: "sophomore",
    label: "sophomore",
  },
  {
    value: "junior",
    label: "junior",
  },
  {
    value: "senior",
    label: "senior",
  },
];

const Profile = () => {
  //   const u = {
  //     firstName: "Peter",
  //     lastName: "Anteater",
  //     gender: "",
  //     year: "Senior",
  //     major: "Computer Science and Engineering",
  //     traits: [
  //       "Chef",
  //       "Pet Lover",
  //       "Photographer",
  //       "Netflix Addict",
  //       "Shopaholic",
  //       "Night Owl",
  //       "Party Animal",
  //       "Music Enthusiast",
  //     ],
  //     about:
  //       "Every year, on July 4th, the USA celebrates the birth of one Sahil Railkar, a 2nd Year Computer Science major who only texts in lowercase, with bald eagles, bbq, and fireworks. Sahil bless America!",
  //     location: "Irvine",
  //     moveIn: "09/26/2021",
  //     moveOut: "06/14/2022",
  //     mixedGender: false,
  //   };
  const { component: Component, props, showModal } = useContext(ModalContext);
  const { data, refetch } = useQuery(GET_USER);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = React.useState({ year: "" });

  const handleYearChange = (e) => {
    setValues({ ...values, year: e.target.value });
  };

  useEffect(() => {
    if (data) {
      setUser(data.getUser);
      console.log(data.getUser);
    }
  }, [data]);

  return (
    <div id="container">
      <TopContainer maxWidth="lg">
        <ImageGroup
          images={user ? user.images || null : null}
          refetchUser={refetch}
        />
        <Button
          color="secondary"
          onClick={() => {
            showModal(UploadImageModal, {
              isOpen: true,
              refetchUser: refetch,
            });
          }}
          startIcon={<AddIcon />}
          variant="contained"
          sx={{ width: 300, mt: 2 }}
        >
          Upload images
        </Button>
        <Typography sx={{ my: "48px" }} variant="h4">
          {user
            ? user.firstName +
              " " +
              user.lastName +
              ", " +
              calculateAge(user.birthday)
            : ""}
        </Typography>
        {Component ? <Component {...props} /> : null}
      </TopContainer>
      <BottomContainer>
        <IconButton
          color="secondary"
          onClick={() => setEditMode(!editMode)}
          sx={{ position: "absolute", right: "16px", top: "16px" }}
        >
          <EditIcon />
        </IconButton>
        {editMode ? (
          <>
            <Typography variant="h6" mb={1}>
              Year:
            </Typography>
            <StyledTextField
              color="secondary"
              id="outlined-select-year"
              select
              label="Select"
              value={values.year}
              onChange={handleYearChange}
              helperText="Please select your year"
            >
              {years.map((option) => (
                <MenuItem
                  color="secondary"
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
          </>
        ) : (
          <>
            <Typography variant="h6" mb={1}>
              I am a...
            </Typography>
            <Typography fontFamily="Bitter, serif" variant="h4" mb={8}>
              a senior majoring in Computer Science and Engineering.
            </Typography>
            <Typography variant="h6" mb={1}>
              I enjoy...
            </Typography>
            <Typography fontFamily="Bitter, serif" variant="h4">
              cooking, petsitting, photography, watching Netflix, shopping, and
              listening to music.
            </Typography>
          </>
        )}
      </BottomContainer>
    </div>

    /* <Row>
        <Col md={1} xl={3}></Col>
        <Col md={10} xl={6} id="content">
            <Row id="name-row"><div id="name">{this.state.firstName + " " + this.state.lastName}</div></Row>
            <Row><div> {this.tags} </div></Row>
            <Row id="about"><div>About</div></Row>
            <Row id="info">
                <div>
                    <div className="sep"><em>Year:</em>{" " + this.state.year}</div>
                    <div className="sep"><em>Major:</em>{" " + this.state.major}</div>
                    <div className="sep"><em>Bio:</em>{" " + this.state.about}</div>
                </div>
            </Row>  
            <Row id="preferences"><div>Preferences</div></Row>
            <Row id="preferences-row">
                <div>
                    <div className="sep"><em>Location:</em>{" " + this.state.location}</div>
                    <div className="sep"><em>Move-in Date:</em>{" " + this.state.moveIn}</div>
                    <div className="sep"><em>Move-out Date:</em>{" " + this.state.moveOut}</div>  
                    <div className="sep"><em>Single Gender/Mixed Gender</em></div>                              
                </div>
            </Row>
        </Col>
        <Col md={1} xl={3}></Col>
    </Row> */
  );
};

export default Profile;
