import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import styles from "./auth.module.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = () => {
    console.log("sign innnn");
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
          onFinish={handleSignin}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
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
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              onChange={({ target }) => setPassword(target.value)}
              placeholder="input password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              value={password}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              block
              className={styles.btnCta}
              disabled={!email || !password}
              type="primary"
              htmlType="submit"
            >
              Sign in
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button block>Use dummy credentials</Button>
          </Form.Item>
        </Form>

        <div className={styles.helperText}>
          <Typography.Text>Don't have an account?</Typography.Text>
          <ReactRouterLink to="/sign-up">
            <Button size="small" type="link">
              Sign up
            </Button>
          </ReactRouterLink>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
