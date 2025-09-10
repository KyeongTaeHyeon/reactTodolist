package com.example.demo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.beans.factory.annotation.Autowired;
import static org.assertj.core.api.Assertions.assertThat;

@Disabled("Requires Docker/Testcontainers; enable only when Docker is available")
@SpringBootTest
@Testcontainers
public class ITTodoRepositoryTest {

    @Container
    static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:10.11")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private TodoRepository todoRepository;

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mariadb::getJdbcUrl);
        registry.add("spring.datasource.username", mariadb::getUsername);
        registry.add("spring.datasource.password", mariadb::getPassword);
        // enable flyway for integration test
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Test
    void saveAndFind() {
        Todo t = new Todo();
        t.setText("integration-test");
        t.setCompleted(false);
        Todo saved = todoRepository.save(t);

        assertThat(saved.getId()).isNotNull();
        assertThat(todoRepository.findById(saved.getId())).isPresent();
    }
}
