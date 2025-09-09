package com.example.demo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TodoService {

    private final TodoRepository repo;

    public TodoService(TodoRepository repo) {
        this.repo = repo;
    }

    public List<Todo> list() {
        return repo.findAll();
    }

    public Todo create(String text) {
        Todo t = new Todo();
        t.setText(text);
        t.setCompleted(false);
        return repo.save(t);
    }

    public Todo update(Long id, Todo updates) {
        return repo.findById(id).map(existing -> {
            if (updates.getText() != null) existing.setText(updates.getText());
            existing.setCompleted(updates.isCompleted());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
