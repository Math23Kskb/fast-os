package br.com.fastgondolas.fastos.server.dto;

import java.util.UUID;

public record TecnicoDto(
        UUID uuid,
        String nome
) {
}
