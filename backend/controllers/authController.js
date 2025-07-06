export const login = (req, res) => {
  const { email, password } = req.body;
  if (email === "test@example.com" && password === "password") {
    res.json({ token: "fake-jwt-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
