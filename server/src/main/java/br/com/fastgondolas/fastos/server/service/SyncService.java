package br.com.fastgondolas.fastos.server.service;

import br.com.fastgondolas.fastos.server.dto.PushChangesDto;
import br.com.fastgondolas.fastos.server.dto.SyncChangesDto;
import br.com.fastgondolas.fastos.server.dto.SyncResponseDto;
import br.com.fastgondolas.fastos.server.dto.SyncTableChanges;
import br.com.fastgondolas.fastos.server.mapper.SyncMapper;
import br.com.fastgondolas.fastos.server.model.OrdemDeServico;
import br.com.fastgondolas.fastos.server.model.OsStatus;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SyncService {

    private final SyncMapper syncMapper;

    private final VisitaRepository visitaRepository;
    private final OrdemDeServicoRepository osRepository;
    private final ClienteRepository clienteRepository;
    private final EnderecoRepository enderecoRepository;
    private final TecnicoRepository tecnicoRepository;
    private final AnexoRepository anexoRepository;

    @Transactional(readOnly = true)
    public SyncResponseDto pullChanges(User tecnico, Instant lastPulledAt) {

        UUID tecnicoId = tecnico.getId();

        var visitasCreated = visitaRepository.findCreatedAfter(tecnicoId, lastPulledAt);
        var visitasUpdated = visitaRepository.findUpdatedAfter(tecnicoId, lastPulledAt);
        var visitasDeleted = visitaRepository.findDeletedAfter(tecnicoId, lastPulledAt);

        var visitasChanges = new SyncTableChanges<>(
                syncMapper.toVisitaSyncDtoList(visitasCreated),
                syncMapper.toVisitaSyncDtoList(visitasUpdated),
                visitasDeleted
        );

        var osChanges = new SyncTableChanges<>(
                syncMapper.toOrdemDeServicoSyncDtoList(osRepository.findCreatedAfter(tecnicoId, lastPulledAt)),
                syncMapper.toOrdemDeServicoSyncDtoList(osRepository.findUpdatedAfter(tecnicoId, lastPulledAt)),
                osRepository.findDeletedAfter(tecnicoId, lastPulledAt)
        );

        var clientesChanges = new SyncTableChanges<>(
                syncMapper.toClienteSyncDtoList(clienteRepository.findCreatedAfter(lastPulledAt)),
                syncMapper.toClienteSyncDtoList(clienteRepository.findUpdatedAfter(lastPulledAt)),
                clienteRepository.findDeletedAfter(lastPulledAt)
        );

        var enderecosChanges = new SyncTableChanges<>(
                syncMapper.toEnderecoSyncDtoList(enderecoRepository.findCreatedAfter(lastPulledAt)),
                syncMapper.toEnderecoSyncDtoList(enderecoRepository.findUpdatedAfter(lastPulledAt)),
                enderecoRepository.findDeletedAfter(lastPulledAt)
        );

        var tecnicosChanges = new SyncTableChanges<>(
                syncMapper.toTecnicoSyncDtoList(tecnicoRepository.findCreatedAfter(lastPulledAt)),
                syncMapper.toTecnicoSyncDtoList(tecnicoRepository.findUpdatedAfter(lastPulledAt)),
                tecnicoRepository.findDeletedAfter(lastPulledAt)
        );

        var anexosChanges = new SyncTableChanges<>(
                syncMapper.toAnexoSyncDtoList(anexoRepository.findCreatedAfter(lastPulledAt)),
                syncMapper.toAnexoSyncDtoList(anexoRepository.findUpdatedAfter(lastPulledAt)),
                anexoRepository.findDeletedAfter(lastPulledAt)
        );


        SyncChangesDto changes = new SyncChangesDto(
                visitasChanges,
                osChanges,
                clientesChanges,
                enderecosChanges,
                tecnicosChanges,
                anexosChanges
        );

        return new SyncResponseDto(changes, Instant.now().toEpochMilli());


    }

    @Transactional
    public void pushChanges(User tecnico, PushChangesDto changes) {
        // TODO: Implementar a lógica de negócio aqui.
        // Por exemplo:
        // 1. Validar os dados recebidos.
        // 2. Iterar sobre a lista de 'ordensDeServicoUpdated' e atualizar cada uma no banco.
        // 3. Iterar sobre a lista de 'visitasCreated' e criar novas visitas.
        // Se qualquer operação falhar, a transação inteira será revertida.
    }

}
