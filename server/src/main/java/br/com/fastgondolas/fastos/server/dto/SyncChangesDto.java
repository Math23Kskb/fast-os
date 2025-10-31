package br.com.fastgondolas.fastos.server.dto;

public record SyncChangesDto(
        SyncTableChanges<VisitaSyncDto> visitas,
        SyncTableChanges<OrdemDeServicoSyncDto> ordensDeServico,
        SyncTableChanges<ClienteSyncDto> clientes,
        SyncTableChanges<EnderecoSyncDto> enderecos,
        SyncTableChanges<TecnicoSyncDto> tecnicos,
        SyncTableChanges<AnexoSyncDto> anexos
) {
}
