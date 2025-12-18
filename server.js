const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// CONFIGURACIÓN DE GEMINI
const genAI = new GoogleGenerativeAI("PEGA_AQUI_TU_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/', (req, res) => {
    res.send('Cerebro de Vealo.online Operativo con IA');
});

app.post('/analizar', async (req, res) => {
    try {
        const { image } = req.body;
        const base64Data = image.split(",")[1];

        const prompt = "Identifica exactamente qué producto es este. Responde SOLO con un objeto JSON: { \"product\": \"Nombre del producto\", \"amazonLink\": \"URL de busqueda en amazon para ese producto\" }";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Limpiamos la respuesta para asegurarnos que sea JSON puro
        const cleanJson = text.replace(/```json|```/g, "");
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Error IA:", error);
        res.status(500).json({ success: false, product: "Error al identificar", amazonLink: "#" });
    }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log('Servidor con IA en linea');
});
