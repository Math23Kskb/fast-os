package br.com.fastgondolas.fastos.server.mapper;

import br.com.fastgondolas.fastos.server.dto.ClienteDto;
import br.com.fastgondolas.fastos.server.model.Cliente;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    ClienteDto toDto(Cliente cliente);

    List<ClienteDto> toListDto(List<Cliente> clientes);
}
