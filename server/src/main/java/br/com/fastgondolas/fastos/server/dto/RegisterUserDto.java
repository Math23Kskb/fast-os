package br.com.fastgondolas.fastos.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserDto(
        @NotBlank(message = "Username não pode ser vazio.")
        String username,

        @NotBlank(message = "Senha não pode estar vazio.")
        @Size(min = 8, message = "Senha deve conter no mínimo 8 caracteres")
        String password,

        @NotBlank(message = "Email não pode estar vazio.")
        @Email(message = "Email com formato invalido")
        String email
) {
}
