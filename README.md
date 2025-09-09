# reactTodolist (Vite + React)

간단한 React + Vite 템플릿입니다. 이 저장소에는 프론트엔드(Vite + React)와 예시 백엔드(Spring Boot)가 함께 포함되어 있어, 프론트엔드 개발과 백엔드 연동 실습에 사용하기 좋습니다.

## 프로젝트 목적

-   개인 학습 또는 소규모 SPA(예: TODO 리스트) 개발을 위한 시작 템플릿
-   프론트엔드와 로컬 Spring Boot 백엔드 간의 프록시/통신 예시 제공

## 기술 스택

-   프론트엔드: JavaScript (React 19, JSX)
-   번들러 / 개발서버: Vite
-   백엔드(옵션): Java (Spring Boot, Maven wrapper 포함) — `spring-sample/`
-   린트: ESLint (설정 파일: `eslint.config.js`)

## 주요 파일

-   `index.html` — 앱 진입 HTML
-   `src/main.jsx` — React 진입점
-   `src/App.jsx` — 메인 컴포넌트(샘플 UI 및 `/api/hello` 호출 예제)
-   `vite.config.js` — Vite 설정(React 플러그인, `/api` 프록시)
-   `package.json` — 의존성 및 실행 스크립트
-   `spring-sample/` — Spring Boot 예시 백엔드 (선택)

## 빠른 시작 (프론트엔드)

1. Node.js 설치 확인 (권장: LTS)

2. 루트에서 의존성 설치:

```bash
npm install
```

3. 개발 서버 시작:

```bash
npm run dev
```

4. 브라우저에서 열기: http://localhost:5173 (Vite 출력에 따라 포트가 다를 수 있음)

## 백엔드 연동(선택)

이 저장소는 `spring-sample/`에 Maven 기반 Spring Boot 예시를 포함합니다. 프론트의 `vite.config.js`는 `/api` 요청을 `http://localhost:8080`으로 프록시하도록 설정되어 있습니다.

1. 백엔드 실행(프로젝트 루트에서):

```bash
./mvnw -f spring-sample/pom.xml spring-boot:run
```

2. 백엔드가 8080에서 실행되면, 프론트에서 `fetch('/api/hello')` 같은 호출이 동작합니다.

### 개발용 MariaDB (Docker) 설정

개발환경에서 MariaDB를 Docker로 띄우면 설정이 간편합니다. 다음은 예시 `docker-compose.yml`입니다 (프로젝트 루트에 추가 가능):

```yaml
version: '3.8'
services:
	mariadb:
		image: mariadb:10.11
		restart: unless-stopped
		environment:
			MYSQL_ROOT_PASSWORD: exampleRootPass
			MYSQL_DATABASE: react_todolist_dev
			MYSQL_USER: devuser
			MYSQL_PASSWORD: devpass
		ports:
			- "3306:3306"
		volumes:
			- mariadb_data:/var/lib/mysql
volumes:
	mariadb_data:
```

실행 방법:

```bash
docker compose up -d
```

DB 접속 정보 (Spring Boot `application.yml`에 사용):

```yaml
spring:
	datasource:
		url: jdbc:mariadb://localhost:3306/react_todolist_dev?useSSL=false&serverTimezone=UTC
		username: devuser
		password: devpass
```

마이그레이션 도구(Flyway)를 사용하면 테이블 생성 스크립트를 `spring-sample/src/main/resources/db/migration/V1__create_todos_table.sql`에 두고 애플리케이션 시작 시 자동 적용할 수 있습니다.

## 권장 다음 단계

-   README에 따라 개발환경 준비
-   TODO 앱 같은 작은 기능을 구현해보면서 컴포넌트, 상태관리, API 연동 연습
-   필요하면 TypeScript 마이그레이션, 라우팅(`react-router`), 테스트(Vitest + Testing Library) 추가

필요하시면 제가 이 저장소에 바로 README 보강 외에 TODO 앱 스캐폴드나 백엔드 간단 API를 추가해 드리겠습니다.
