const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración estilo MuOnline
const dbConfig = {
    user: 'vealo_admin',
    password: 'ljmm19326228', 
    server: '51.81.29.31', 
    database: 'VealoDB',
    options: {
        encrypt: false, // Obligatorio para SQL 2008 R2
        trustServerCertificate: true,
        enableArithAbort: true
    },
    port: 1433
};

// RUTA: REGISTRO PROFESIONAL (Basado en MEMB_INFO)
app.post('/api/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    // Generamos un ID corto (máximo 10 caracteres) como pide MuOnline
    const memb_id = email.split('@')[0].substring(0, 10);

    try {
        let pool = await sql.connect(dbConfig);

        // 1. Verificar si el ID o Email ya existe en MEMB_INFO
        let checkUser = await pool.request()
            .input('id', sql.VarChar, memb_id)
            .input('email', sql.VarChar, email)
            .query('SELECT memb___id FROM MEMB_INFO WHERE memb___id = @id OR mail_addr = @email');

        if (checkUser.recordset.length > 0) {
            return res.json({ success: true, message: "Usuario ya existe", newUser: false });
        }

        // 2. Insertar en MEMB_INFO (El Trigger hará el resto en MEMB_STAT)
        await pool.request()
            .input('id', sql.VarChar, memb_id)
            .input('pwd', sql.VarChar, password || '123456') // Password por defecto si no hay
            .input('name', sql.VarChar, nombre.substring(0, 10))
            .input('mail', sql.VarChar, email)
            .query(`INSERT INTO MEMB_INFO (memb___id, memb__pwd, memb_name, mail_addr, trafico_acumulado, status) 
                    VALUES (@id, @pwd, @name, @mail, 0.0, 'ACTIVE')`);

        res.json({ success: true, message: "Registro exitoso en VealoDB", newUser: true });

    } catch (err) {
        console.error("Error en DB:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Vealo-Mu activo en puerto ${PORT}`));
