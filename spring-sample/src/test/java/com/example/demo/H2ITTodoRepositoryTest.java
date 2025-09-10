package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class H2ITTodoRepositoryTest {

    @Autowired
    private TodoRepository todoRepository;

    @Test
    void saveAndFind_H2() {
        Todo t = new Todo();
        t.setText("h2-integration");
        t.setCompleted(false);
        Todo saved = todoRepository.save(t);

        assertThat(saved.getId()).isNotNull();
        assertThat(todoRepository.findById(saved.getId())).isPresent();
    }
}
