package com.fmgc.warehouse.dto.request;

/**
 * Request DTO for /ai/scan-invoice
 * message is optional (scanInvoice does not need it).
 */
public class AiScanRequest {
    private String imageBase64;
    private String mimeType;

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    /** Convert to AiChatRequest so AiService can reuse the same method */
    public AiChatRequest toAiChatRequest() {
        AiChatRequest r = new AiChatRequest();
        r.setMessage("scan");  // placeholder, not used by scanInvoice()
        r.setImageBase64(imageBase64);
        r.setMimeType(mimeType);
        return r;
    }
}
