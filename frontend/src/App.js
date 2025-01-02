import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminModule from "./components/Admin/AdminModule";
import Dashboard from "./components/User/Dashboard";
import CalendarView from "./components/User/Calendar";
import ReportingDashboard from "./components/User/ReportingDashboard";
import Login from "./components/Login"; // Import Login Component
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  CssBaseline,
  Container,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E88E5" },
    secondary: { main: "#D32F2F" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1E88E5" },
    secondary: { main: "#D32F2F" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Router>
        {/* Navigation Bar */}
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Button href="/dashboard" color="inherit">
                  Dashboard
                </Button>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Button href="/calendar" color="inherit">
                  Calendar
                </Button>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Button href="/reports" color="inherit">
                  Reports
                </Button>
              </MenuItem>
              {isAuthenticated && (
                <MenuItem onClick={handleMenuClose}>
                  <Button href="/admin" color="inherit">
                    Admin Module
                  </Button>
                </MenuItem>
              )}
            </Menu>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Communication Tracker
            </Typography>
            <Tooltip title={`Switch to ${themeMode === "light" ? "Dark" : "Light"} Mode`}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>
            {isAuthenticated ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" href="/login">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Routes */}
        <Container maxWidth="lg" sx={{ paddingY: "2rem" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route
              path="/admin"
              element={
                isAuthenticated ? <AdminModule /> : <Navigate to="/login" />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/reports" element={<ReportingDashboard />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
