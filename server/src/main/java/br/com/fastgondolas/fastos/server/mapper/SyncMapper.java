package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.*;
import br.com.fastgondolas.fastos.server.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface SyncMapper {

    @Mapping(source = "tecnico.id", target = "tecnico_id")
    @Mapping(source = "endereco.id", target = "endereco_id")
    @Mapping(source = "dataSaidaEmpresa", target = "dataSaidaEmpresa")
    @Mapping(source = "dataChegadaCliente", target = "dataChegadaCliente")
    @Mapping(source = "dataSaidaCliente", target = "dataSaidaCliente")
    @Mapping(source = "dataChegadaEmpresa", target = "dataChegadaEmpresa")
    VisitaSyncDto toVisitaSyncDto(Visita visita);
    List<VisitaSyncDto> toVisitaSyncDtoList(List<Visita> visitas);

    @Mapping(source = "cliente.id", target = "cliente_id")
    @Mapping(source = "endereco.id", target = "endereco_id")
    @Mapping(source = "tecnicoResponsavel.id", target = "tecnico_responsavel_id")
    @Mapping(source = "visitas", target = "visitaId", qualifiedByName = "findActiveVisitId")
    OrdemDeServicoSyncDto toOrdemDeServicoSyncDto(OrdemDeServico os);
    List<OrdemDeServicoSyncDto> toOrdemDeServicoSyncDtoList(List<OrdemDeServico> osList);

    ClienteSyncDto toClienteSyncDto(Cliente cliente);
    List<ClienteSyncDto> toClienteSyncDtoList(List<Cliente> clientes);

    @Mapping(source = "cliente.id", target = "cliente_id")
    EnderecoSyncDto toEnderecoSyncDto(Endereco endereco);
    List<EnderecoSyncDto> toEnderecoSyncDtoList(List<Endereco> enderecos);

    TecnicoSyncDto toTecnicoSyncDto(Tecnico tecnico);
    List<TecnicoSyncDto> toTecnicoSyncDtoList(List<Tecnico> tecnicos);

    @Mapping(source = "ordemDeServico.id", target = "ordem_de_servico_id")
    AnexoSyncDto toAnexoSyncDto(Anexo anexo);
    List<AnexoSyncDto> toAnexoSyncDtoList(List<Anexo> anexos);

    @Named("findActiveVisitId")
    default UUID findActiveVisitId(List<Visita> visitas) {
        if (visitas == null || visitas.isEmpty()) {
            return null;
        }
        return visitas.stream()
                .filter(v -> "AGENDADA".equals(v.getStatus()) || "EM_ANDAMENTO".equals(v.getStatus()))
                .findFirst()
                .map(Visita::getId)
                .orElse(visitas.stream()
                        .max(Comparator.comparing(Visita::getCreatedAt))
                        .map(Visita::getId)
                        .orElse(null));
    }
}