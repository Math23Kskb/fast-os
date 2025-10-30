package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Anexo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnexoRepository extends JpaRepository<Anexo, UUID> {

    @Query("SELECT a FROM Anexo a WHERE a.createdAt > :timestamp")
    List<Anexo> findCreatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT a FROM Anexo a WHERE a.updatedAt > :timestamp AND a.createdAt <= :timestamp AND a.deleted = false")
    List<Anexo> findUpdatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT a.id FROM Anexo a WHERE a.updatedAt > :timestamp AND a.deleted = true")
    List<UUID> findDeletedAfter(@Param("timestamp") Instant timestamp);
}
