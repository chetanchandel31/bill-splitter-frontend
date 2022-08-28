import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, message, Typography } from "antd";
import useSignup from "api/hooks/auth/useSignup";
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { showErrorMessage } from "utils";
import styles from "./auth.module.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const doConfirmPasswordMatch = confirmPassword === password;
  const doDisableSignup =
    !name || !email || !password || !confirmPassword || !doConfirmPasswordMatch;

  const onSuccess = () => {
    navigate("/sign-in");
    message.success(
      "Signup successful, you can now sign in with your newly created account"
    );
  };

  const { isLoading, mutate } = useSignup({
    onSuccess,
    onError: showErrorMessage,
  });

  const handleSignup = () => {
    mutate({ email, name, password });
  };

  return (
    <div className={styles.formContainer}>
      <Card
        title="Sign in to continue"
        bordered={false}
        className={styles.card}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={handleSignup}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              onChange={({ target }) => setName(target.value)}
              placeholder="Enter your username"
              prefix={<UserOutlined className="site-form-item-icon" />}
              value={name}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input a valid email!",
                // eslint-disable-next-line no-useless-escape
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              },
            ]}
          >
            <Input
              name="email"
              type="email"
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Enter your email"
              prefix={<MailOutlined className="site-form-item-icon" />}
              value={email}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input a password with minimum 6 characters",
                min: 6,
              },
            ]}
          >
            <Input.Password
              onChange={({ target }) => setPassword(target.value)}
              placeholder="enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={password}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm-password"
            rules={[
              {
                required: true,
                message: "Please input a password with minimum 6 characters",
                min: 6,
              },
            ]}
          >
            <Input.Password
              onChange={({ target }) => setConfirmPassword(target.value)}
              placeholder="re-enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={confirmPassword}
            />
          </Form.Item>

          {confirmPassword && !doConfirmPasswordMatch && (
            <Alert message="Passwords don't match" type="error" showIcon />
          )}

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              block
              disabled={doDisableSignup}
              className={styles.btnCta}
              loading={isLoading}
              type="primary"
              htmlType="submit"
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.helperText}>
          <Typography.Text>Already have an account?</Typography.Text>
          <ReactRouterLink to="/sign-in">
            <Button size="small" type="link">
              Sign in
            </Button>
          </ReactRouterLink>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
