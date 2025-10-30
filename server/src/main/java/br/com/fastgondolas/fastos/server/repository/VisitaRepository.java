package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Visita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface VisitaRepository extends JpaRepository<Visita, UUID> {

    List<Visita> findByTecnicoId(UUID tecnicoId);

    @Query("SELECT v FROM Visita v WHERE v.tecnico.id = :tecnicoId AND v.createdAt > :timestamp")
    List<Visita> findCreatedAfter(@Param("tecnicoId") UUID tecnicoId, @Param("timestamp") Instant timestamp);

    @Query("SELECT v FROM Visita v WHERE v.tecnico.id = :tecnicoId AND v.updatedAt > :timestamp AND v.createdAt <= :timestamp AND v.deleted = false")
    List<Visita> findUpdatedAfter(@Param("tecnicoId") UUID tecnicoId, @Param("timestamp") Instant timestamp);

    @Query("SELECT v.id FROM Visita v WHERE v.tecnico.id = :tecnicoId AND v.updatedAt > :timestamp AND v.deleted = true")
    List<UUID> findDeletedAfter(@Param("tecnicoId") UUID tecnicoId, @Param("timestamp") Instant timestamp);

    long countByOrdensDeServicoId(UUID ordemDeServicoId);
}
