package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.VisitaDto;
import br.com.fastgondolas.fastos.server.model.Visita;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


import java.util.List;

@Mapper(componentModel = "spring", uses = {ClienteMapper.class, EnderecoMapper.class, OrdemDeServicoMapper.class})
public interface VisitaMapper {

    @Mapping(source = "endereco.cliente", target = "cliente")
    VisitaDto toDto(Visita visita);

    List<VisitaDto> toListDto(List<Visita> visitas);
}
