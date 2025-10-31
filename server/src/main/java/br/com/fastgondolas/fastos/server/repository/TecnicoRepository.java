package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface TecnicoRepository extends JpaRepository<Tecnico, UUID> {

    @Query("SELECT t FROM Tecnico t WHERE t.createdAt > :timestamp")
    List<Tecnico> findCreatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT t FROM Tecnico t WHERE t.updatedAt > :timestamp AND t.createdAt <= :timestamp AND t.deleted = false")
    List<Tecnico> findUpdatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT t.id FROM Tecnico t WHERE t.updatedAt > :timestamp AND t.deleted = true")
    List<UUID> findDeletedAfter(@Param("timestamp") Instant timestamp);
}
