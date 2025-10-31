package br.com.fastgondolas.fastos.server.dto;

import br.com.fastgondolas.fastos.server.model.OsStatus;

import java.util.UUID;

public record OrdemDeServicoResumoDto(
        UUID id,
        String numeroOs,
        OsStatus status
) {
}
