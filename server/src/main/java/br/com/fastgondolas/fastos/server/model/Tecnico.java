package br.com.fastgondolas.fastos.server.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tecnico")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String nome;
    private String matricula;
    private String empresa;
    private String telefone;
    private String cidade;
    private String uf;
    private boolean ativo = true;

    @Builder.Default
    private Instant criadoEm = Instant.now();
    @Builder.Default
    private Instant atualizadaEm = Instant.now();
}
