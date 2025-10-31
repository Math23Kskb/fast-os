package br.com.fastgondolas.fastos.server.dto;

import br.com.fastgondolas.fastos.server.model.OsStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrdemDeServicoDto(
        UUID id,
        String numeroOs,
        OsStatus status,
        String numeroSerieEquipamento,
        Instant dataAgendamento,
        ClienteDto cliente,
        EnderecoDto endereco,
        TecnicoDto tecnico,
        List<CategoriaDto> problemaDetalhado,
        List<AnexoDto> anexos
) {}
