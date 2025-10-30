package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.OrdemDeServico;
import br.com.fastgondolas.fastos.server.model.OsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrdemDeServicoRepository extends JpaRepository<OrdemDeServico, UUID> {

    boolean existsByTecnicoResponsavelAndStatusIn(UUID tecnicoId, List<OsStatus> statuses);
}
