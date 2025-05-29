import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import CadastroForm from "./components/CadastroForm";
import NotaForm from "./components/NotaForm";
import NotaItem from "./components/NotaItem";
import Toast from "./components/Toast";
import FullscreenImage from "./components/FullscreenImage";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [tela, setTela] = useState("login"); // "login", "cadastro", "notas"

  useEffect(() => {
    if (token) {
      setTela("notas");
    } else {
      setTela("login");
    }
  }, [token]);

  function handleLogin(tok, nome) {
    setToken(tok);
    setUserName(nome);
    localStorage.setItem("token", tok);
    localStorage.setItem("userName", nome);
    setTela("notas");
  }
  function handleLogout() {
    setToken("");
    setUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setTela("login");
  }

  if (tela === "login") {
    return (
      <LoginForm
        onLogin={handleLogin}
        onShowCadastro={() => setTela("cadastro")}
      />
    );
  }
  if (tela === "cadastro") {
    return (
      <CadastroForm
        onCadastro={() => setTela("login")}
        onShowLogin={() => setTela("login")}
      />
    );
  }

  // Telas autenticadas (notas e tal)
  return (
    <div className="app">
      <header>
        <h1>Caderno Digital</h1>
        <span>Bem-vindo, {userName}!</span>
        <button onClick={handleLogout}>Sair</button>
      </header>
      {/* ... aqui pode manter o restante da sua lógica, como lista de notas, NotaForm, etc. ... */}
      {/* Exemplo: */}
      {/* <NotasPage token={token} /> */}
    </div>
  );
}

export default App;