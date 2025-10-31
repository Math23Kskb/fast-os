package br.com.fastgondolas.fastos.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

public record EnderecoSyncDto(
        UUID id,
        @JsonProperty("created_at")
        Instant createdAt,
        @JsonProperty("updated_at")
        Instant updatedAt,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String estado,
        String cep,
        String descricao,
        @JsonProperty("cliente_id")
        UUID cliente_id
) {
}
