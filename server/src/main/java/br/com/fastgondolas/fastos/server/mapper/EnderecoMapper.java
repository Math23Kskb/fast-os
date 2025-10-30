package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.EnderecoDto;
import br.com.fastgondolas.fastos.server.model.Endereco;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EnderecoMapper {

    EnderecoDto toDto(Endereco endereco);

    List<EnderecoDto> toListDto(List<Endereco> enderecos);
}
