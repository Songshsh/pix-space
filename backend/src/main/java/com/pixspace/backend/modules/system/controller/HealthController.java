package com.pixspace.backend.modules.system.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pixspace.backend.common.api.ApiResponse;

@RestController
@RequestMapping("/health")
public class HealthController {

  @GetMapping
  public ApiResponse<Map<String, String>> health() {
    return ApiResponse.ok(Map.of("status", "ok"));
  }
}
