Spring Sample

간단한 Spring Boot 애플리케이션입니다.

실행 방법:

```bash
# 프로젝트 루트에서
cd spring-sample
mvn spring-boot:run
```

서버가 8080 포트에서 실행됩니다. React 개발 서버가 `vite.config.js`에서 `/api`를 프록시하도록 설정되어 있어, React에서 `fetch('/api/hello')`로 호출하면 이 엔드포인트로 요청이 전달됩니다.
