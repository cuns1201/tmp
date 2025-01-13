import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import CloseButton from "react-bootstrap/CloseButton";
import PropTypes from "prop-types";
import styled from "styled-components";

import '../index.css'

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const ModalTitle = styled.h5`
  font-size: 1.25rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const Form = styled.form``;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  flex: 0 0 30%; /* Adjust as needed */
  text-align: right;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ContinueButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's on top */
`;

const OTPInput = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    console.log(otp);
    let email = window.localStorage.getItem('email');
    let verifyEmail = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });
      verifyEmail = await verifyEmail.json();
      console.log("verifyEmail ", verifyEmail.success);

      if (verifyEmail.success == true) {
        let userInfo = localStorage.getItem("userInfo");
        userInfo = JSON.parse(userInfo);
        if (userInfo && userInfo.token) {
          alert("You have succesfully registered an account");
          navigate("/");
          window.location.reload();
        }
      } else {
        window.localStorage.removeItem("userInfo");
        alert("You failed to verify-email");
      }
      window.localStorage.removeItem("email");
  };

  const onClose = () => {
    window.localStorage.removeItem("userInfo");
    window.localStorage.removeItem("email");
    navigate("/");
    window.location.reload();
  };

  return (
    <Overlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Enter OTP</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label htmlFor="inputOTP">OTP code</Label>
              <Input
                type="text"
                id="inputOTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <ContinueButton onClick={handleContinue}>Continue</ContinueButton>
        </ModalFooter>
      </ModalContent>
    </Overlay>
  );
};

OTPInput.propTypes = {
    onClose: PropTypes.func.isRequired,
};

OTPInput.defaultProps = { onClose: () => {} };

export default OTPInput;
