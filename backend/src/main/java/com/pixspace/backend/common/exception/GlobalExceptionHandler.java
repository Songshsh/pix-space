package com.pixspace.backend.common.exception;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.pixspace.backend.common.api.ApiResponse;

// ═══════════════════════ 全局异常拦截器 ═══════════════════════
// 功能：统一捕获所有 Controller 抛出的异常，转换为标准的 ApiResponse JSON 格式返回
// 机制：Spring 在 Controller 方法执行时，任何未经 try-catch 的异常都会被这里拦截
// 匹配规则：从具体异常类型到笼统异常类型，第一个匹配的 handler 生效（不会重复处理）
@Slf4j // Lombok：编译时生成 log 对象，等价于 LoggerFactory.getLogger(...)
@RestControllerAdvice // @ControllerAdvice（全局拦截所有 Controller）+ @ResponseBody（返回值写 HTTP 响应体）
public class GlobalExceptionHandler {

  // ── ① 请求体参数校验失败（如 @Valid 校验不通过） ──
  @ExceptionHandler(MethodArgumentNotValidException.class) // 只拦截这个特定异常
  @ResponseStatus(HttpStatus.BAD_REQUEST) // HTTP 状态码设为 400（覆盖 Spring 默认的 200）
  public ApiResponse<Void> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException exception) {
    // 从异常对象中提取第一个校验失败字段的信息，拼成 "字段名: 错误描述"
    String message = exception.getBindingResult().getFieldErrors().stream()
        .findFirst() // 只取第一个校验失败的字段
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .orElse("请求参数校验失败"); // 兜底：理论上不会走到这里
    return ApiResponse.fail(40000, message); // → {"code":40000, "message":"email: 邮箱格式不正确", "data":null}
  }

  // ── ② 路径参数校验失败 ──
  @ExceptionHandler(ConstraintViolationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST) // HTTP 400
  public ApiResponse<Void> handleConstraintViolationException(ConstraintViolationException exception) {
    return ApiResponse.fail(40000, exception.getMessage());
  }

  // ── ③ 请求体 JSON 格式错误 / 非法参数 ──
  // HttpMessageNotReadableException 和 IllegalArgumentException 可能包含内部信息，不直接暴露原始
  // message
  @ExceptionHandler({
      HttpMessageNotReadableException.class, // 请求体 JSON 格式错误，无法解析
      MissingServletRequestParameterException.class, // 缺少必填的 query/form 参数
      MethodArgumentTypeMismatchException.class, // 参数类型不匹配（如 ?id=abc 但期望 Long）
      IllegalArgumentException.class // 手动 throw 的不合法参数
  })
  @ResponseStatus(HttpStatus.BAD_REQUEST) // HTTP 400
  public ApiResponse<Void> handleBadRequestException() {
    return ApiResponse.fail(40000, "请求参数不合法");
  }

  // ── ④ 请求路径无对应资源/接口（404） ──
  // Spring MVC 6.1+（Spring Boot 3.2+）对未匹配路径抛 NoResourceFoundException，默认返回 HTML
  // 404。
  // 前端统一拦截层期望所有响应均为 ApiResponse JSON，故此处转成标准 JSON 结构
  @ExceptionHandler(NoResourceFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND) // HTTP 404
  public ApiResponse<Void> handleNoResourceFoundException() {
    return ApiResponse.fail(40400, "请求的资源不存在");
  }

  // ── ⑤ 上传文件超过大小限制（413） ──
  // multipart 上限见 application.yml（max-file-size / max-request-size）。
  // 超限属于“客户端请求体过大”，返回 413 语义精确，避免被误报为 500 服务端故障
  @ExceptionHandler(MaxUploadSizeExceededException.class)
  @ResponseStatus(HttpStatus.PAYLOAD_TOO_LARGE) // HTTP 413
  public ApiResponse<Void> handleMaxUploadSizeExceededException() {
    return ApiResponse.fail(41300, "上传文件大小超过限制");
  }

  // ── ⑥ 方法级鉴权：未认证（401） ──
  // URL 级未登录由 SecurityConfig 的 authenticationEntryPoint 在过滤器链处理；
  // 但 @PreAuthorize 等方法级鉴权在 MVC 阶段抛出，会先被本 Advice 捕获，
  // 故需显式处理，否则会落到底部 Exception 处理器被误返回 500。与过滤器层口径一致（码 40100）
  @ExceptionHandler(AuthenticationException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED) // HTTP 401
  public ApiResponse<Void> handleAuthenticationException() {
    return ApiResponse.fail(40100, "未登录");
  }

  // ── ⑦ 方法级鉴权：权限不足（403） ──
  // 同上：@PreAuthorize 鉴权失败抛出的 AccessDeniedException 在 MVC 阶段，需显式转 403 JSON，
  // 与 SecurityConfig 的 accessDeniedHandler 口径一致（码 40300），避免被底部转成 500
  @ExceptionHandler(AccessDeniedException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN) // HTTP 403
  public ApiResponse<Void> handleAccessDeniedException() {
    return ApiResponse.fail(40300, "权限不足");
  }

  // ── ⑧ 请求方法不支持（405） ──
  // 如对只支持 GET 的接口发 POST。因本 Advice 的兜底 Exception 处理器会先于 Spring 默认解析器生效，
  // 若不显式处理会被误返回 500；显式转 405 语义更准（权衡：自定义后不再自动补 Allow 头，前端统一按 JSON 处理）
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED) // HTTP 405
  public ApiResponse<Void> handleMethodNotSupported() {
    return ApiResponse.fail(40500, "请求方法不支持");
  }

  // ── ⑨ 请求体媒体类型不支持（415） ──
  // 如接口需要 application/json 却收到 text/plain；同样会被兜底误返 500，显式转 415
  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE) // HTTP 415
  public ApiResponse<Void> handleMediaTypeNotSupported() {
    return ApiResponse.fail(41500, "不支持的请求媒体类型");
  }

  // ── ⑩ 兜底：以上都未匹配的其他所有异常（属于服务端 Bug，需要排查） ──
  @ExceptionHandler(Exception.class) // Exception 是所有异常的父类，兜底匹配
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500
  public ApiResponse<Void> handleException(Exception exception) {
    log.error("unhandled exception", exception); // ⚠️ 记录完整堆栈到日志，方便排查
    // 不把 exception.getMessage() 返回给前端，避免泄露内部敏感信息（如表名、SQL 语句等）
    return ApiResponse.fail(50000, "服务器内部错误，请稍后重试");
  }
}
