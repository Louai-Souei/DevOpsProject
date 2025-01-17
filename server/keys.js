const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres", // Remplacez par votre nom d'utilisateur PostgreSQL
  host: "postgres",     // Remplacez par l'hôte de votre base de données
  database: "postgres", // Remplacez par le nom de votre base de données
  password: "postgres_password", // Remplacez par votre mot de passe PostgreSQL
  port: 5432,            // Par défaut, PostgreSQL utilise le port 5432
});

module.exports = pool;
