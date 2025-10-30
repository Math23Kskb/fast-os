package br.com.fastgondolas.fastos.server.dto;

import java.util.List;
import java.util.UUID;

public record VisitaDto(
        UUID id,
        String status,
        ClienteDto cliente,
        EnderecoDto endereco,
        List<OrdemDeServicoResumoDto> ordensDeServico
) {
}
