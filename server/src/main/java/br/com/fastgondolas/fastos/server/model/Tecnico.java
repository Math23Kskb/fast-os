package br.com.fastgondolas.fastos.server.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tecnicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tecnico extends BaseEntity {

    private String nome;
    private String matricula;
    private String empresa;
    private String telefone;
    private String cidade;
    private String uf;

    @Builder.Default
    private boolean ativo = true;

}
