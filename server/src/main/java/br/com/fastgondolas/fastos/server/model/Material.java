package br.com.fastgondolas.fastos.server.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "materiais")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Material extends BaseEntity {

    @Column(unique = true)
    private String nome;

    private String descricao;
    private String unidadeMedida;
    private BigDecimal valorUnitario;
    private String codigoBarras;
}