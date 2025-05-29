import React, { useState } from "react";

function CadastroForm({ onCadastro, onShowLogin }) {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMsg("");
    try {
      const resp = await fetch("http://localhost:5000/api/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, nome }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setMsg("Cadastro realizado! Faça login.");
      } else {
        setErro(data.erro || "Erro ao cadastrar.");
      }
    } catch (err) {
      setErro("Erro de conexão.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />
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
      <button type="submit">Cadastrar</button>
      <button type="button" onClick={onShowLogin}>Voltar</button>
      {erro && <div style={{ color: "red" }}>{erro}</div>}
      {msg && <div style={{ color: "green" }}>{msg}</div>}
    </form>
  );
}

export default CadastroForm;