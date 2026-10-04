package com.fmgc.warehouse.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {
    @NotBlank(message = "Message is required")
    private String message;
    private String imageBase64;
    private String mimeType;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
}
