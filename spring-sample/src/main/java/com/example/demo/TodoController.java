package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Allow cross-origin requests from the static site (IIS) origin
import org.springframework.web.bind.annotation.CrossOrigin;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://proxogus.codns.com:9002")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Todo> list() {
        return service.list();
    }

    @PostMapping
    public ResponseEntity<Todo> create(@RequestBody Todo req) {
        Todo created = service.create(req.getText());
        return ResponseEntity.created(URI.create("/api/todos/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
