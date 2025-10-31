package br.com.fastgondolas.fastos.server.dto;

import java.util.UUID;

public record EnderecoDto(
        UUID id,
        String logradouro,
        String cidade
) {
}
