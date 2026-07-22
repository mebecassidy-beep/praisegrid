import QRCode from "qrcode";

export async function generateQrPngBuffer(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: "png",
    width: 640,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 320,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}
