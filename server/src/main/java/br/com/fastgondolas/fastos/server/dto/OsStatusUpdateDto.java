package br.com.fastgondolas.fastos.server.dto;

import java.util.UUID;

public record OsStatusUpdateDto(
        UUID id,
        String status
) {
}
