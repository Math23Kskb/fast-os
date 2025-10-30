package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, UUID> {
}
