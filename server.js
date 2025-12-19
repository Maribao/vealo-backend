const sql = require('mssql');

const dbConfig = {
    user: 'vealo_admin',
    password: 'TuPasswordSeguro',
    server: 'IP_DE_TU_VPS', // La IP de tu Windows Server
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
