import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, message, Typography } from "antd";
import useSignin, { SuccessResponseSignin } from "api/hooks/auth/useSignin";
import { useAuth } from "contexts/auth-context";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { showErrorMessage } from "utils";
import styles from "./auth.module.css";

const SignIn = () => {
  const { signIn } = useAuth();
  const [form] = Form.useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSuccess = ({ data }: SuccessResponseSignin) => {
    message.success("signed in successfully");
    signIn(data); // basically sets user info in 1. context and 2. local storage and redirects
  };

  const { mutate, isLoading } = useSignin({
    onError: showErrorMessage,
    onSuccess,
  });

  const handleSignin = () => {
    mutate({ email, password });
  };

  const fillDummyCredentials = () => {
    setEmail("test@test.com");
    setPassword("123456");
    form.setFieldsValue({ email: "test@test.com", password: "123456" });
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
          onFinish={handleSignin}
          autoComplete="off"
        >
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
              loading={isLoading}
              type="primary"
              htmlType="submit"
            >
              Sign in
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button block onClick={fillDummyCredentials}>
              Use dummy credentials
            </Button>
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
