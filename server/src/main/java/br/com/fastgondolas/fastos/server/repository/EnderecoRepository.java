package br.com.fastgondolas.fastos.server.repository;

import br.com.fastgondolas.fastos.server.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, UUID> {

    @Query("SELECT e FROM Endereco e WHERE e.createdAt > :timestamp")
    List<Endereco> findCreatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT e FROM Endereco e WHERE e.updatedAt > :timestamp AND e.createdAt <= :timestamp AND e.deleted = false")
    List<Endereco> findUpdatedAfter(@Param("timestamp") Instant timestamp);

    @Query("SELECT e.id FROM Endereco e WHERE e.updatedAt > :timestamp AND e.deleted = true")
    List<UUID> findDeletedAfter(@Param("timestamp") Instant timestamp);
}
