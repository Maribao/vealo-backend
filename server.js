const dbConfig = {
    user: 'vealo_admin',
    password: 'ljmm19326228',
    server: '51.81.29.31', // Tu IP del VPS
    database: 'VealoDB',
    options: {
        encrypt: false, // Importante para compatibilidad MuOnline/SQL 2008
        trustServerCertificate: true,
        enableArithAbort: true
    },
    port: 1433
};
