//App.js
import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import Auth from "./Components/Auth/Auth";

function App() {
  const [active, setActive] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Verify User on App Restart
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setIsAuthenticated(false);

      try {
        const response = await fetch("http://localhost:5001/api/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include", // Send cookies to backend
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    };

    verifyUser();
  }, []);

  const displayData = () => {
    switch (active) {
      case 1:
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <AppStyled bg={bg} className="App">
      {isAuthenticated ? (
        <>
          {orbMemo}
          <MainLayout>
            <Navigation active={active} setActive={setActive} />
            <main>{displayData()}</main>
          </MainLayout>
        </>
      ) : (
        <Auth setIsAuthenticated={setIsAuthenticated} />
      )}
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .logout {
    position: absolute;
    top: 20px;
    right: 20px;
    background: red;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
`;

export default App;
