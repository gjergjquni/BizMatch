# Setup i DeepSeek API për Vlerësimin e Biznesit

## 1. Marrja e API Key

1. Shkoni në [DeepSeek Platform](https://platform.deepseek.com/)
2. Regjistrohuni ose hyni në llogarinë tuaj
3. Shkoni te "API Keys" në dashboard
4. Klikoni "Create API Key"
5. Kopjoni API key-n e krijuar

## 2. Konfigurimi i API Key

Krijoni një file `.env` në root të projektit:

```env
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

Zëvendësoni `your_deepseek_api_key_here` me API key-n tuaj të vërtetë.

## 3. Përdorimi

1. Hapni aplikacionin në `http://localhost:5176/`
2. Klikoni "Vlerësimi i biznesit me AI"
3. Plotësoni detajet e biznesit
4. Klikoni "Analizo biznesin me AI"
5. Prisni përgjigjen nga DeepSeek API

## 4. Funksionaliteti

Faqja e re `BusinessRating.tsx`:

- **Analizë e detajuar**: AI-ja analizon biznesin bazuar në të dhënat e dhëna
- **Vlerësimi nga 1-100**: Një pikë i plotë për potencialin e biznesit
- **Niveli i rrezikut**: Vlerësimi i rrezikut (i ulët/mesatar/i lartë)
- **Potenciali i investimit**: Vlerësimi i potencialit për investitorë
- **Rekomandimet**: Sugjerime specifike për përmirësim

## 5. Struktura e API Response

```json
{
  "score": 85,
  "analysis": "Analiza e detajuar e biznesit...",
  "recommendations": [
    "Rekomandimi 1",
    "Rekomandimi 2"
  ],
  "riskLevel": "low",
  "investmentPotential": "excellent"
}
```

## 6. Troubleshooting

- **Gabim "API Error"**: Kontrolloni nëse API key është e saktë
- **Gabim "Gabim i panjohur"**: Kontrolloni lidhjen e internetit
- **Vlerësimi nuk shfaqet**: Kontrolloni console për gabime

## 7. Siguria

- Mos ndani API key-n në kodin publik
- Përdoreni variablat e mjedisit për API keys
- Kontrolloni rate limits të DeepSeek API 