package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MaterialRepository extends JpaRepository<Material, UUID> {
}
