package br.com.fastgondolas.fastos.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

public record VisitaSyncDto(
        UUID id,
        String status,
        Instant createdAt,
        Instant updatedAt,
        UUID tecnico_id,
        UUID endereco_id,

        @JsonProperty("data_saida_empresa") Instant dataSaidaEmpresa,
        @JsonProperty("data_chegada_cliente") Instant dataChegadaCliente,
        @JsonProperty("data_saida_cliente") Instant dataSaidaCliente,
        @JsonProperty("data_chegada_empresa") Instant dataChegadaEmpresa
) {
}
