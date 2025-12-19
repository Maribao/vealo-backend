const sql = require('mssql');

const dbConfig = {
    user: 'vealo_admin',
    password: 'ljmm19326228',
    server: '51.81.29.31', // La IP de tu Windows Server
    database: 'VealoDB',
    options: {
        encrypt: true, // Importante para conexiones remotas
        trustServerCertificate: true
    }
};

// Ruta para registrar usuario en SQL Server
app.post('/api/registro', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('nombre', sql.NVarChar, req.body.nombre)
            .input('email', sql.NVarChar, req.body.email)
            .query('INSERT INTO Usuarios (nombre, email) VALUES (@nombre, @email)');
        res.json({ success: true });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
