package br.com.fastgondolas.fastos.server.dto;

import java.time.Instant;
import java.util.UUID;

public record VisitaSyncDto(
        UUID id,
        String status,
        Instant createdAt,
        Instant updatedAt,
        UUID tecnico_id,
        UUID endereco_id
) {
}
