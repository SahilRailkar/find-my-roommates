import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

// import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { ModalContext } from "../../contexts/ModalContext";
import SignUpModal from "../SignUpModal/SignUpModal";
// import { LOG_IN } from "../../graphql/mutations";
import { GET_USER } from "../../graphql/queries";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
};

export default function LogInModal() {
  const { showModal, hideModal } = useContext(ModalContext);
  const history = useHistory();
  // const [logIn, { data, loading, error }] = useMutation(LOG_IN);
  const { refetch } = useQuery(GET_USER);
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState({});

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const logInUser = () => {
    const { email, password } = values;
    axios({
      method: "POST",
      data: {
        email,
        password,
      },
      withCredentials: true,
      url: "http://localhost:4000/login",
    })
      .then(() => {
        hideModal();
        refetch();
        history.push("/profile");
      })
      .catch((err) => {
        if (err.response) {
          setErrors({
            [err.response.data.value]: err.response.data.error,
          });
        }
      });
    // logIn({
    //   variables: {
    //     email,
    //     password,
    //   },
    // });
    // if (error) {
    //   console.error(error);
    // } else {
    //   console.log(data);
    //   history.push("/profile");
    // }
  };

  return (
    <div>
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            hideModal();
          }
        }}
        open
      >
        <Box sx={style}>
          <IconButton
            onClick={hideModal}
            sx={{
              left: "8px",
              position: "absolute",
              top: "8px",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography p={2} textAlign="center">
            Log in
          </Typography>
          <Box bgcolor="#eeeeee" height="1px" />
          <Box p={4}>
            <Typography pb={2} variant="h6">
              Welcome back!
            </Typography>
            <TextField
              error={typeof errors.email !== "undefined"}
              helperText={errors.email}
              id="outlined-basic"
              label="Email address"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              size="small"
              sx={{ marginBottom: "24px" }}
              variant="outlined"
              fullWidth
            />
            <TextField
              error={typeof errors.password !== "undefined"}
              helperText={errors.password}
              id="outlined-basic-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              label="Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              size="small"
              sx={{ marginBottom: "24px" }}
              type={values.showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => {
                  hideModal();
                  showModal(SignUpModal, { isOpen: true });
                }}
                variant="text"
              >
                New to Rümer? Sign up
              </Button>
              <Button onClick={logInUser} size="large" variant="contained">
                Log in
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
