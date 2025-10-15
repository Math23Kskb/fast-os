package br.com.fastgondolas.fastos.server.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponseDto(
        int status,
        String error,
        String message,
        String path
) {}
