package br.com.fastgondolas.fastos.server.dto;

import java.util.UUID;

public record AnexoDto(
        UUID id,
        String url,
        String tipo,
        String descricao
) {
}