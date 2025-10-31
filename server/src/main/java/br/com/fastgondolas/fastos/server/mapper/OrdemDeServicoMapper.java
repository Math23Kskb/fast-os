package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.OrdemDeServicoDto;
import br.com.fastgondolas.fastos.server.dto.OrdemDeServicoResumoDto;
import br.com.fastgondolas.fastos.server.model.OrdemDeServico;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {
        UserMapper.class,
        AnexoMapper.class,
        ClienteMapper.class,
        EnderecoMapper.class
})
public interface OrdemDeServicoMapper {

    @Mapping(source = "tecnicoResponsavel", target = "tecnico")
    OrdemDeServicoDto toDto(OrdemDeServico ordemDeServico);

    OrdemDeServicoResumoDto toResumoDto(OrdemDeServico ordemDeServico);
}
