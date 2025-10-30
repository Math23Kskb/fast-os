package br.com.fastgondolas.fastos.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

public record ClienteSyncDto(
        UUID id,
        @JsonProperty("created_at")
        Instant createdAt,
        @JsonProperty("updated_at")
        Instant updatedAt,
        String nome,
        String contato,
        String email,
        String telefone,
        boolean ativo
) {
}
