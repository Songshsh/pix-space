package com.pixspace.backend.common.api;

public record ApiResponse<T>(int code, String message, T data) {

  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(0, "ok", data);
  }

  public static <T> ApiResponse<T> fail(int code, String message) {
    return new ApiResponse<>(code, message, null);
  }

  /** 带 data 的错误返回，用于需要同时返回错误附加信息的场景（如验证码错误时返回剩余重试次数） */
  public static <T> ApiResponse<T> fail(int code, String message, T data) {
    return new ApiResponse<>(code, message, data);
  }
}
