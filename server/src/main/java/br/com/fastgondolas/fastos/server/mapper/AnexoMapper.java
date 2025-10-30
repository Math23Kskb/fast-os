package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.AnexoDto;
import br.com.fastgondolas.fastos.server.model.Anexo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnexoMapper {

    @Mapping(source = "urlArquivo", target = "url")
    @Mapping(source = "tipoArquivo", target = "tipo")
    AnexoDto toDto(Anexo anexo);
}
