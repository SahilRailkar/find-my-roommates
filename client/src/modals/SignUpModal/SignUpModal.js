import axios from "axios";
import React, { useContext, useState } from "react";

// import { useMutation } from "@apollo/client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { ModalContext } from "../../contexts/ModalContext";
// import { SIGN_UP } from "../../graphql/mutations";
import LogInModal from "../LogInModal/LogInModal";

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

const genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export default function SignUpModal() {
  const { showModal, hideModal } = useContext(ModalContext);
  // const [signUp, { data, loading, error }] = useMutation(SIGN_UP);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    gender: "Male",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateValues = () => {
    const { firstName, lastName, email, password, confirmPassword, birthday } =
      values;

    let passwordError = "";
    if (password.includes(" ")) {
      passwordError = "Your password can't contain a blank space";
    }

    let birthdayError = "";
    const birthdayDate = new Date(birthday);
    const date = new Date();
    if (date <= birthdayDate) {
      birthdayError = "Enter a valid birthday";
    }

    const obj = {
      firstName: firstName.trim() === "" ? "Enter first name" : "",
      lastName: lastName.trim() === "" ? "Enter last name" : "",
      email: validateEmail(email) ? "" : "Enter valid email address",
      password: password === "" ? "Enter password" : passwordError,
      confirmPassword:
        password === confirmPassword ? "" : "Those passwords didn't match",
      birthday: birthday === "" ? "Enter your birthday" : birthdayError,
    };
    setErrors({ ...obj });
    return Object.values(obj).every((x) => x === "");
  };

  const signUpUser = () => {
    const { firstName, lastName, email, password, birthday, gender } = values;
    axios({
      method: "POST",
      data: {
        firstName,
        lastName,
        email,
        password,
        birthday,
        gender,
      },
      withCredentials: true,
      url: "http://localhost:4000/signup",
    })
      .then(() => {
        hideModal();
        showModal(LogInModal, { isOpen: true });
      })
      .catch((err) => {
        if (err.response) {
          setErrors({
            ...errors,
            [err.response.data.value]: err.response.data.error,
          });
        }
      });
    // signUp({
    //   variables: {
    //     firstName,
    //     lastName,
    //     email,
    //     password,
    //     birthday,
    //     gender,
    //   },
    // });
  };

  const handleClickSignUp = () => {
    if (validateValues()) {
      signUpUser();
      // if (error) {
      //   console.error(error);
      // } else {
      //   console.log(data);
      //   hideModal();
      //   showModal(LogInModal, { isOpen: true });
      // }
    }
  };

  return (
    <div>
      <Modal
        open
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            hideModal();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
            Sign up
          </Typography>
          <Box bgcolor="#eeeeee" height="1px" />
          <Box p={4}>
            <Typography pb={2} variant="h6">
              Welcome to Rümer!
            </Typography>
            <Box
              sx={{
                display: "flex",
                marginBottom: "24px",
              }}
            >
              <TextField
                error={errors.firstName !== ""}
                helperText={errors.firstName}
                id="outlined-basic-first-name"
                label="First name"
                onChange={(e) =>
                  setValues({ ...values, firstName: e.target.value })
                }
                size="small"
                sx={{ marginRight: "10px" }}
                variant="outlined"
                fullWidth
              />
              <TextField
                error={errors.lastName !== ""}
                helperText={errors.lastName}
                id="outlined-basic-last-name"
                label="Last name"
                onChange={(e) =>
                  setValues({ ...values, lastName: e.target.value })
                }
                size="small"
                variant="outlined"
                fullWidth
              />
            </Box>
            <TextField
              error={errors.email !== ""}
              helperText={errors.email}
              id="outlined-basic-email"
              label="Email address"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              size="small"
              sx={{ marginBottom: "24px" }}
              variant="outlined"
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                marginBottom: "24px",
              }}
            >
              <TextField
                error={errors.password !== ""}
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
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                size="small"
                sx={{ marginRight: "10px" }}
                type={values.showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
              />
              <TextField
                error={errors.confirmPassword !== ""}
                helperText={errors.confirmPassword}
                id="outlined-basic-confirm-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {values.showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Confirm password"
                onChange={(e) =>
                  setValues({ ...values, confirmPassword: e.target.value })
                }
                size="small"
                type={values.showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
              />
            </Box>
            <TextField
              error={errors.birthday !== ""}
              helperText={errors.birthday}
              id="outlined-basic-birthday"
              InputLabelProps={{ shrink: true }}
              label="Birthday"
              onChange={(e) =>
                setValues({
                  ...values,
                  birthday: new Date(e.target.value).toISOString(),
                })
              }
              size="small"
              sx={{ marginBottom: "24px" }}
              type="date"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="outlined-select-gender"
              label="Gender"
              onChange={(e) =>
                setValues({
                  ...values,
                  gender: e.target.value,
                })
              }
              SelectProps={{
                native: true,
              }}
              size="small"
              sx={{ marginBottom: "24px" }}
              fullWidth
              select
            >
              {genders.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => {
                  hideModal();
                  showModal(LogInModal, { isOpen: true });
                }}
                variant="text"
              >
                Log in instead
              </Button>
              <Button
                onClick={handleClickSignUp}
                size="large"
                variant="contained"
              >
                Sign up
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
