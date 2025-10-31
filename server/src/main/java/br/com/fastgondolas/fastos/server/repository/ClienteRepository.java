package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    @Query("SELECT c FROM Cliente c WHERE c.createdAt > :timestamp")
    List<Cliente> findCreatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT c FROM Cliente c WHERE c.updatedAt > :timestamp AND c.createdAt <= :timestamp AND c.deleted = false")
    List<Cliente> findUpdatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT c.id FROM Cliente c WHERE c.updatedAt > :timestamp AND c.deleted = true")
    List<UUID> findDeletedAfter(@Param("timestamp") Instant timestamp);
}
