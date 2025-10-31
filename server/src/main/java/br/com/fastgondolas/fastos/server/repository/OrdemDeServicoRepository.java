package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.OrdemDeServico;
import br.com.fastgondolas.fastos.server.model.OsStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrdemDeServicoRepository extends JpaRepository<OrdemDeServico, UUID> {

    boolean existsByTecnicoResponsavelIdAndStatusIn(UUID tecnicoId, List<OsStatus> statuses);

    @Query("SELECT os FROM OrdemDeServico os " +
            "LEFT JOIN FETCH os.anexos " +
            "JOIN FETCH os.cliente " +
            "JOIN FETCH os.endereco " +
            "WHERE os.id = :id")
    Optional<OrdemDeServico> findDetalhesById(UUID id);

    @Query("SELECT os FROM OrdemDeServico os WHERE os.tecnicoResponsavel.id = :tecnicoId AND os.createdAt > :timestamp")
    List<OrdemDeServico> findCreatedAfter(@Param("tecnicoId") UUID tecnicoId, @Param("timestamp") Instant timestamp);

    @Query("SELECT os FROM OrdemDeServico os WHERE os.tecnicoResponsavel.id = :tecnicoId AND os.updatedAt > :timestamp AND os.createdAt <= :timestamp AND os.deleted = false")
    List<OrdemDeServico> findUpdatedAfter(@Param("tecnicoId") UUID tecnicoId, @Param("timestamp") Instant timestamp);

    @Query("SELECT os.id FROM OrdemDeServico os WHERE os.tecnicoResponsavel.id = :tecnicoId AND os.updatedAt > :timestamp AND os.deleted = true")
    List<UUID> findDeletedAfter(@Param("tecnicoId") UUID tecnicoId, @Param("timestamp") Instant timestamp);
}
