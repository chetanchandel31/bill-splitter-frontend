import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import useSignup from "api/hooks/auth/useSignup";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import styles from "./auth.module.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const doConfirmPasswordMatch = confirmPassword === password;
  const doDisableSignup =
    !name || !email || !password || !confirmPassword || !doConfirmPasswordMatch;

  const { mutate } = useSignup();

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
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
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
                message: "Please input your password!",
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
                message: "Please input your password!",
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

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              block
              disabled={doDisableSignup}
              className={styles.btnCta}
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
