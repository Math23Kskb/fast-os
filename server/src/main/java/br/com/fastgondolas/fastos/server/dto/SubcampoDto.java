package br.com.fastgondolas.fastos.server.dto;

public record SubcampoDto(
        String nome,
        boolean selecionado,
        String defeito
) {
}
