package br.com.fastgondolas.fastos.server.dto;

public record SyncResponseDto(
        SyncChangesDto changes,
        long timestamp
) {
}
