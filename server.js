const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// CONFIGURACIÓN DE GEMINI
const genAI = new GoogleGenerativeAI("TU_API_KEY_AQUÍ"); // Reemplaza con tu llave
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/analizar', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image data" });

        const base64Data = image.split(\",\")[1];

        // NUEVO PROMPT: Análisis de Mercado Global 2025
        const prompt = `Actúa como un experto en e-commerce global. Analiza esta imagen y responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
        {
          "product": "Nombre comercial preciso",
          "brand": "Marca detectada",
          "price_usd": "Precio estimado en dólares",
          "category": "Categoría de mercado",
          "global_links": {
            "amazon": "https://www.amazon.com/s?k=Producto",
            "ebay": "https://www.ebay.com/sch/i.html?_nkw=Producto",
            "aliexpress": "https://www.aliexpress.com/wholesale?SearchText=Producto"
          },
          "futuristic_desc": "Descripción técnica futurista de 2 líneas para un marketplace de lujo",
          "market_status": "Alta demanda / Stock limitado / Tendencia"
        }`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text();
        const cleanJson = text.replace(/```json|```/g, "").trim();
        
        // Enviar respuesta al frontend
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Error Global:", error);
        res.status(500).json({ error: "Error en el análisis de mercado" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Marketplace Engine en puerto ${PORT}`));
