package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Visita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VisitaRepository extends JpaRepository<Visita, UUID> {

    List<Visita> findByTecnicoId(UUID tecnicoId);

    long countByOrdensDeServicoId(UUID ordemDeServicoId);
}
