package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.TecnicoDto;
import br.com.fastgondolas.fastos.server.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "uuid")
    @Mapping(source = "username", target = "nome")
    TecnicoDto toTecnicoDto(User user);
}