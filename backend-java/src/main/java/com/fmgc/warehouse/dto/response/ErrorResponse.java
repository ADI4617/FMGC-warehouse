package com.fmgc.warehouse.dto.response;

import java.util.List;

public class ErrorResponse {
    private boolean success;
    private String message;
    private String code;
    private List<String> errors;

    public ErrorResponse(boolean success, String message, String code, List<String> errors) {
        this.success = success;
        this.message = message;
        this.code = code;
        this.errors = errors;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }
}
