const React = require("react");
const {Html, Head, Preview, Body, Container, Section, Heading, Text, Button} = require("@react-email/components");

function PasswordResetEmail({usuario, resetLink}) {
  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, "Recupera tu contraseña en Monteflor"),
    React.createElement(
      Body,
      {style: main},
      React.createElement(
        Container,
        {style: card},
        React.createElement(Heading, {style: title}, "Recuperación de contraseña"),
        React.createElement(Text, {style: text}, "Hola ", React.createElement("strong", null, usuario.nombre), ","),
        React.createElement(Text, {style: text}, "Hemos recibido una solicitud para restablecer tu contraseña."),
        React.createElement(Text, {style: text}, "Haz clic en el botón de abajo para continuar:"),
        React.createElement(
          Section,
          {style: {textAlign: "center"}},
          React.createElement(Button, {style: button, href: resetLink}, "Restablecer contraseña")
        ),
        React.createElement(Text, {style: footer}, "Si no solicitaste este cambio, puedes ignorar este mensaje.")
      )
    )
  );
}

const main = {
  backgroundColor: "#f4f4f7",
  padding: "40px 0",
  fontFamily: "Helvetica, Arial, sans-serif",
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  maxWidth: "480px",
  margin: "0 auto",
  padding: "32px 24px",
};

const title = {
  color: "#222",
  fontSize: "20px",
  marginBottom: "16px",
  textAlign: "center",
};

const text = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#333",
  marginBottom: "12px",
};

const button = {
  backgroundColor: "#007bff",
  color: "#fff",
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  display: "inline-block",
  fontWeight: "bold",
};

const footer = {
  fontSize: "12px",
  color: "#999",
  marginTop: "20px",
  textAlign: "center",
};

module.exports = PasswordResetEmail;
