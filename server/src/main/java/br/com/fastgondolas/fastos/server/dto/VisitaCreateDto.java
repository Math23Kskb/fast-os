package br.com.fastgondolas.fastos.server.dto;

import java.util.UUID;

public record VisitaCreateDto(
        UUID id,
        UUID endeereco,
        String status,
        String observacoes
) {
}
