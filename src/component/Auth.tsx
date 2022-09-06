import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface Forms {
  fullName?: string;
  userName?: string;
  phoneNumber?: number | string;
  avatarUrl?: string;
  password?: string;
  confirmPassword?: string;
}
const initialStateForm: Partial<Forms> = {
  fullName: "",
  userName: "",
  phoneNumber: "",
  avatarUrl: "",
  password: "",
  confirmPassword: "",
};
const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [form, setForm] = useState<Forms>(initialStateForm);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const switchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const { avatarUrl, password, phoneNumber, userName }: any = form;
      if (password?.length < 5) {
        return alert("Password length > 5");
      }
      const {
        data: { token, userId, hashPassword, fullName },
      } = await axios.post(
        `${process.env.REACT_APP_API_URL_AUTH}/${
          isSignUp ? "signup" : "login"
        }`,
        { userName, password, fullName: form.fullName, phoneNumber, avatarUrl }
      );
      cookies.set("token", token);
      cookies.set("userName", userName);
      cookies.set("fullName", fullName);
      cookies.set("userId", userId);
      if (isSignUp) {
        cookies.set("phoneNumber", phoneNumber);
        cookies.set("avatarUrl", avatarUrl);
        cookies.set("hashPassword", hashPassword);
      }
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.message);
      return;
    }
  };

  return (
    <>
      <div className="auth__form-container">
        <div className="auth__form-container_fields">
          <div className="auth__form-container_fields-content">
            <p>{isSignUp ? "SignUp" : "SignIn"}</p>
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="fullName">FullName</label>
                  <input
                    value={form.fullName}
                    name="fullName"
                    type={"text"}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="userName">UserName</label>
                <input
                  value={form.userName}
                  name="userName"
                  type={"text"}
                  placeholder="User name"
                  onChange={handleChange}
                  required
                />
              </div>
              {isSignUp && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    value={form.phoneNumber}
                    name="phoneNumber"
                    type={"text"}
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              {isSignUp && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="avatarUrl">Avatar Url</label>
                  <input
                    value={form.avatarUrl}
                    name="avatarUrl"
                    type={"text"}
                    placeholder="Avatar url"
                    onChange={handleChange}
                    // required
                  />
                </div>
              )}
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="password">Password</label>
                <input
                  value={form.password}
                  name="password"
                  type={"password"}
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </div>
              {isSignUp && (
                <div className="auth__form-container_fields-content_input">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    value={form.confirmPassword}
                    name="confirmPassword"
                    type={"password"}
                    placeholder="Confirm password"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="auth__form-container_fields-content_button">
                <button type="submit">{isSignUp ? "SignUp" : "SignIn"}</button>
              </div>
            </form>
            <div className="auth__form-container_fields-account">
              <p>
                {isSignUp
                  ? "Already have an account "
                  : "Dont't have an account "}
                <span onClick={switchMode}>
                  {isSignUp ? "SignIn" : "SignUp"}{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Auth;
