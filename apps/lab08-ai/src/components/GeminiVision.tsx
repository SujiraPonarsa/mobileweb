import "./GeminiVision.css";
import { useState, useRef, useCallback } from "react";
import { GeminiVisionService } from "../core/gemini.service";
import { PhotoService } from "../core/photo.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

export default function GeminiVisionApp() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imgData, setImgData] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [analyzed, setAnalyzed] = useState<boolean>(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setError("");
    setResult(null);
    setAnalyzed(false);
    const data = await PhotoService.fromFile(file);
    setImgData(data);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onTakePhoto = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await PhotoService.fromCamera();
      setImgData(data);
      setPreviewUrl(`data:${data.mimeType};base64,${data.base64}`);
      setResult(null);
      setAnalyzed(false);
    } catch (err: unknown) {
      setError(
        "ถ่ายภาพไม่สำเร็จ: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  const onAnalyze = async () => {
    if (!imgData) return;
    setLoading(true);
    setError("");
    try {
      const res = await GeminiVisionService.analyze(imgData);
      setResult(res);
      setAnalyzed(true);
    } catch (err: unknown) {
      setError(
        "วิเคราะห์ไม่สำเร็จ: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImgData(null);
    setPreviewUrl("");
    setResult(null);
    setAnalyzed(false);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="wrap">

        {/* ── Header ── */}
        <div className="header fu">
          <span className="pill">
            <span className="dot" />
            GEMINI VISION
          </span>
          <h1 className="header-title">วิเคราะห์ภาพด้วย AI</h1>
          <p className="header-sub">
            อัปโหลดหรือถ่ายภาพ แล้วให้ Gemini วิเคราะห์รายละเอียดให้คุณ
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div className="card d1 fu" style={{ padding: 24, marginBottom: 16 }}>

          {!previewUrl ? (
            <div
              className={`drop${dragOver ? " over" : ""}`}
              style={{ marginBottom: 20 }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <div className="drop-icon">🖼️</div>
              <p className="drop-title">วางภาพที่นี่ หรือคลิกเพื่อเลือก</p>
              <p className="drop-sub">รองรับ JPG · PNG · WEBP · GIF</p>
            </div>
          ) : (
            <div className="preview-wrap">
              <img src={previewUrl} alt="preview" className="preview-img" />
              {analyzed && (
                <div className="analyzed-badge">✓ วิเคราะห์แล้ว</div>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFileChange}
          />

          <div className="btn-row">
            <button className="btn btn-main" onClick={() => fileRef.current?.click()}>
              📁  เลือกไฟล์ภาพ
            </button>
            <button className="btn btn-main" onClick={onTakePhoto} disabled={loading}>
              📷  ถ่ายภาพ
            </button>
            {previewUrl && (
              <>
                <button
                  className="btn btn-main"
                  onClick={onAnalyze}
                  disabled={!imgData || loading}
                >
                  {loading ? (
                    <span className="loading-inner">
                      <span className="spin" />
                      กำลังวิเคราะห์...
                    </span>
                  ) : (
                    "🔍  วิเคราะห์ภาพ"
                  )}
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  ล้างทั้งหมด
                </button>
              </>
            )}
          </div>

          {error && <div className="error-box">⚠️ {error}</div>}
        </div>

        {/* ── Results Card ── */}
        {result && (
          <div className="card d2 fu" style={{ padding: 24 }}>

            <div className="result-header">
              <div className="result-dot" />
              <span className="result-title">ผลการวิเคราะห์</span>
            </div>

            {result.caption && (
              <div className="desc-box">
                <p className="desc-text">{result.caption}</p>
              </div>
            )}

            {result.tags && result.tags.length > 0 && (
              <div className="row">
                <div className="row-inner">
                  <div className="ibox">🏷️</div>
                  <div>
                    <p className="lbl">Tags</p>
                    <div>
                      {result.tags.map((t, i) => (
                        <span key={i} className="tv">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.objects && result.objects.length > 0 && (
              <div className="row">
                <div className="row-inner">
                  <div className="ibox">📦</div>
                  <div style={{ width: "100%" }}>
                    <p className="lbl">Objects detected</p>
                    <div className="objects-list">
                      {result.objects.map((obj, i) => (
                        <div key={i} className="object-item">
                          <span className="object-name">{obj.name}</span>
                          {obj.confidence != null && (
                            <div className="object-conf-wrap">
                              <div className="object-conf-bar">
                                <div
                                  className="object-conf-fill"
                                  style={{ width: `${Math.round(obj.confidence * 100)}%` }}
                                />
                              </div>
                              <span className="object-conf-val">
                                {Math.round(obj.confidence * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.safety && (
              <div className="row">
                <div className="row-inner">
                  <div className="ibox">🛡️</div>
                  <div>
                    <p className="lbl">Safety</p>
                    <span className={`safety-badge ${result.safety.isSensitive ? "sensitive" : "safe"}`}>
                      {result.safety.isSensitive ? "⚠️ Sensitive" : "✓ Safe"}
                    </span>
                    {result.safety.notes && (
                      <p className="safety-notes">{result.safety.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <p className="footer">
          Powered by Google Gemini 2.5 Flash · Lab08 โดย สุจิรา
        </p>
      </div>
    </>
  );
}