const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
    res.json({ status: "Cerebro en la nube activo" });
});

app.post('/analizar', (req, res) => {
    res.json({ 
        success: true, 
        product: "Producto Detectado (IA Cloud)",
        amazonLink: "https://www.amazon.com/s?k=product" 
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor volando en puerto ${PORT}`);
});
