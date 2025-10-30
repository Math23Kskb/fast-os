package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Anexo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AnexoRepository extends JpaRepository<Anexo, UUID> {
}
