package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.*;
import br.com.fastgondolas.fastos.server.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SyncMapper {

    @Mapping(source = "tecnico.id", target = "tecnico_id")
    @Mapping(source = "endereco.id", target = "endereco_id")
    VisitaSyncDto toVisitaSyncDto(Visita visita);
    List<VisitaSyncDto> toVisitaSyncDtoList(List<Visita> visitas);

    @Mapping(source = "cliente.id", target = "cliente_id")
    @Mapping(source = "endereco.id", target = "endereco_id")
    @Mapping(source = "tecnicoResponsavel.id", target = "tecnico_responsavel_id")
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
}