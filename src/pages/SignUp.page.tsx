import { Box, Button, Link, Sheet, TextField, Typography } from "@mui/joy";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const doConfirmPasswordMatch = confirmPassword === password;
  const doDisableSignup =
    !name || !email || !password || !confirmPassword || !doConfirmPasswordMatch;

  const handleSignup = () => {
    console.log("sign uppp");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Sheet
        sx={{
          maxWidth: 400,
          width: "100%",
          mx: 2,
          my: 8,
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body2">Sign up to continue</Typography>
        </div>
        <TextField
          name="name"
          type="text"
          placeholder="john doe"
          label="Name"
          onChange={({ target }) => setName(target.value)}
          value={name}
        />
        <TextField
          name="email"
          type="email"
          placeholder="johndoe@email.com"
          label="Email"
          onChange={({ target }) => setEmail(target.value)}
          value={email}
        />
        <TextField
          name="password"
          type="password"
          placeholder="password"
          label="Password"
          onChange={({ target }) => setPassword(target.value)}
          value={password}
        />
        <TextField
          name="confirm-password"
          type="password"
          placeholder="confirm password"
          label="Confirm Password"
          onChange={({ target }) => setConfirmPassword(target.value)}
          value={confirmPassword}
        />

        {confirmPassword && !doConfirmPasswordMatch && (
          <Typography
            variant="soft"
            color="danger"
            startDecorator="🚨"
            py={1}
            px={1}
            borderRadius="xs"
            display="inline-flex"
            fontSize="sm"
            sx={{ "--Typography-gap": "0.5rem" }}
          >
            Passwords don't match
          </Typography>
        )}

        <Button
          disabled={doDisableSignup}
          onClick={handleSignup}
          sx={{ mt: 1 }}
        >
          Sign up
        </Button>
        <Typography
          endDecorator={
            <Link component={ReactRouterLink} to="/sign-in">
              Sign in
            </Link>
          }
          fontSize="sm"
          sx={{ alignSelf: "center" }}
        >
          Already have an account?
        </Typography>
      </Sheet>
    </Box>
  );
};

export default SignUp;
