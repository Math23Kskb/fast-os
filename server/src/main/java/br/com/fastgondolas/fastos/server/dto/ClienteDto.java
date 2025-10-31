package br.com.fastgondolas.fastos.server.dto;

import java.util.UUID;

public record ClienteDto(
        UUID id,
        String nome,
        String contato
) {
}
