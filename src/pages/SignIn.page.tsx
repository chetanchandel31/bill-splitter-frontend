import { Box, Button, Link, Sheet, TextField, Typography } from "@mui/joy";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = () => {
    console.log("sign innnn");
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
          <Typography level="body2">Sign in to continue</Typography>
        </div>
        <TextField
          label="Email"
          name="email"
          onChange={({ target }) => setEmail(target.value)}
          placeholder="johndoe@email.com"
          type="email"
          value={email}
        />
        <TextField
          label="Password"
          name="password"
          onChange={({ target }) => setPassword(target.value)}
          type="password"
          placeholder="password"
          value={password}
        />

        <Button
          disabled={!email || !password}
          onClick={handleSignin}
          sx={{ mt: 1 }}
        >
          Sign in
        </Button>
        <Button variant="soft">Use dummy credentials</Button>
        <Typography
          endDecorator={
            <Link component={ReactRouterLink} to="/sign-up">
              Sign up
            </Link>
          }
          fontSize="sm"
          sx={{ alignSelf: "center" }}
        >
          Don't have an account?
        </Typography>
      </Sheet>
    </Box>
  );
};

export default SignIn;
