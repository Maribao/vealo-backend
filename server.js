const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// CONFIGURACIÓN DE GEMINI CON TU LLAVE ACTUALIZADA
const genAI = new GoogleGenerativeAI("AIzaSyDWOxVD8twNp0IAoUMBpRkvkRUJ180Nmh4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/', (req, res) => {
    res.send('Cerebro de Vealo.online Operativo con IA');
});

app.post('/analizar', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image data" });

        const base64Data = image.split(",")[1];

        // Instrucciones para la IA
        const prompt = "Identifica exactamente qué producto es este. Responde SOLO con un objeto JSON: { \"product\": \"Nombre del producto\", \"amazonLink\": \"https://www.amazon.com/s?k=Nombre+del+producto\" }";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Limpieza de formato para asegurar que sea un JSON válido
        const cleanJson = text.replace(/```json|```/g, "").trim();
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Error IA:", error);
        res.status(500).json({ 
            success: false, 
            product: "Error al identificar el producto", 
            amazonLink: "https://www.amazon.com/" 
        });
    }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log('Servidor con IA en linea en puerto ' + port);
});
