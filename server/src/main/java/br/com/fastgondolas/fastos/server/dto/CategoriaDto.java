package br.com.fastgondolas.fastos.server.dto;

import br.com.fastgondolas.fastos.server.model.CategoriaEnum;

import java.util.List;

public record CategoriaDto(
        CategoriaEnum categoria,
        List<SubcampoDto> subcampos
) {
}
