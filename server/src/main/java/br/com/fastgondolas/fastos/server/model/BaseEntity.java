package br.com.fastgondolas.fastos.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
@Getter
@Setter
@SQLDelete(sql= "Update #{entityName} SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean deleted = false;
}
