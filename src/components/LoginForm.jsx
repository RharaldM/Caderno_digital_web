import React, { useState } from "react";

function LoginForm({ onLogin, onShowCadastro }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const resp = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await resp.json();
      if (resp.ok) {
        onLogin(data.token, data.nome);
      } else {
        setErro(data.erro || "Erro ao fazer login.");
      }
    } catch (err) {
      setErro("Erro de conexão.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Entrar</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
      <button type="button" onClick={onShowCadastro}>Cadastrar</button>
      {erro && <div style={{ color: "red" }}>{erro}</div>}
    </form>
  );
}

export default LoginForm;