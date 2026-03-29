import type { Base64Image, ImageAnalysisResult } from "./ai.interface";

const GEMINI_API_KEY = "AIzaSyCJXZ1O8iWghp83HHw9LfH_Trw6y5-QR-E";

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt =
      `วิเคราะห์ภาพนี้และตอบกลับเป็น JSON เท่านั้น ตาม schema นี้:\n` +
      `{"caption":"คำบรรยายสั้น 1 ประโยคภาษาไทย","tags":["keyword1","keyword2"],"objects":[{"name":"ชื่อวัตถุ","confidence":0.9}],"safety":{"isSensitive":false,"notes":"หมายเหตุถ้ามี"}}\n` +
      `ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น`;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: image.mimeType, data: image.base64 } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    return JSON.parse(text) as ImageAnalysisResult;
  }
}