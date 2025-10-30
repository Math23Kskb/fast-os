package br.com.fastgondolas.fastos.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

public record TecnicoSyncDto(
        UUID id,
        @JsonProperty("created_at")
        Instant createdAt,
        @JsonProperty("updated_at")
        Instant updatedAt,
        String nome,
        String matricula,
        String empresa,
        String telefone,
        String cidade,
        String uf,
        boolean ativo
) {
}
