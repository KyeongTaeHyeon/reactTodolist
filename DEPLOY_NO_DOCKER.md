목적

이 문서는 Docker를 사용하지 않고 별도 서버(Windows 또는 Linux)에 Spring Boot 애플리케이션과 MariaDB를 배포하는 절차를 정리합니다. 배포용 JAR 실행, systemd 서비스 템플릿, 시작/중지 스크립트, MariaDB 설치(리눅스/윈도우), Flyway 마이그레이션 수동 적용, 검증 및 롤백 절차를 포함합니다.

전제

-   서버에 SSH 접속권한이 있으며 필요한 경우 sudo 권한이 있음
-   Java 17 이상 설치 가능

Notes about external `application.yml` on Windows

-   Place `application.yml` at `C:\\apps\\spring-sample\\application.yml` to override the defaults embedded in the JAR.
-   Recommended: do NOT store sensitive credentials in plaintext inside repository files. Use one of these strategies:
    -   Set environment variables on the Windows host: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`.
    -   Store the external `application.yml` with restricted ACLs and use a low-privilege local DB user.
-   Example prod datasource entry for remote MariaDB:
    ```yaml
    spring:
    	 datasource:
    		 url: jdbc:mariadb://proxogus.codns.com:32272/react_todolist_dev?useSSL=false&serverTimezone=UTC
    		 username: produser
    		 password: "<secure-password>"
    ```
-   Maven 빌드를 수행할 수 있거나 빌드된 JAR을 전송할 수 있음
-   DB 연결 정보는 환경변수 또는 `.env` 파일로 관리

1. 빌드(JAR 생성)

로컬에서 빌드 후 서버로 전달하는 방법 권장.

```bash
# 프로젝트 루트에서
./mvnw -f spring-sample/pom.xml clean package -DskipTests
# 생성된 JAR 확인
ls spring-sample/target/*.jar
```

2. .env 예시

`spring-sample/.env.example` 파일을 서버에 `.env`로 복사해 값만 채워 사용합니다.

변수 예시:

```
SPRING_DATASOURCE_URL=jdbc:mariadb://localhost:3306/react_todolist_dev?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=devuser
SPRING_DATASOURCE_PASSWORD=devpass
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SERVER_PORT=8080
```

3. JAR 전송 및 수동 실행

```bash
# scp로 서버에 전송
scp spring-sample/target/spring-sample-0.0.1-SNAPSHOT.jar user@server:/opt/apps/spring-sample/

# 서버에서 환경변수 로드 후 실행
cd /opt/apps/spring-sample
export $(grep -v '^#' .env | xargs)
nohup java -jar spring-sample-0.0.1-SNAPSHOT.jar --spring.config.additional-location=application.yml > app.log 2>&1 &
```

4. systemd 서비스 템플릿

서버(Linux 시스템)에 서비스로 등록하면 자동 기동 및 재시작 관리가 편리합니다. 템플릿 파일은 `spring-sample/deploy/spring-sample.service`입니다. 복사 후 `/etc/systemd/system/spring-sample.service`로 두고 `systemctl daemon-reload` 후 `systemctl enable --now spring-sample`로 실행하세요.

기본 템플릿(로컬 파일 참고):

```
[Unit]
Description=spring-sample service
After=network.target

[Service]
User=appuser
WorkingDirectory=/opt/apps/spring-sample
EnvironmentFile=/opt/apps/spring-sample/.env
ExecStart=/usr/bin/java -jar /opt/apps/spring-sample/spring-sample-0.0.1-SNAPSHOT.jar --spring.config.additional-location=application.yml
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

5. start/stop 스크립트(간단)

`spring-sample/start.sh`와 `spring-sample/stop.sh` 템플릿을 제공했습니다. 필요한 경로와 사용자 권한을 맞춰 사용하세요.

6. MariaDB 설치 가이드

Linux - Ubuntu (예시):

```bash
# 업데이트
sudo apt update
sudo apt install -y mariadb-server
# 보안 설정(권장)
sudo mysql_secure_installation
# MariaDB 서비스 시작/확인
sudo systemctl enable --now mariadb
sudo systemctl status mariadb
```

Linux - CentOS/RHEL (예시):

```bash
sudo yum install -y mariadb-server
sudo systemctl enable --now mariadb
```

Windows:

-   MSI 설치 파일(https://mariadb.org) 다운로드 후 설치
-   또는 Chocolatey 사용:

```powershell
choco install mariadb -y
```

7. 초기 DB 및 사용자 생성

서버에서 MySQL 클라이언트로 접속 후 다음을 실행:

```sql
CREATE DATABASE react_todolist_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'devuser'@'localhost' IDENTIFIED BY 'devpass';
GRANT ALL PRIVILEGES ON react_todolist_dev.* TO 'devuser'@'localhost';
FLUSH PRIVILEGES;
```

8. Flyway 마이그레이션 적용

자동: 애플리케이션이 시작될 때 Flyway가 `classpath:db/migration`의 SQL을 적용하도록 설정되어 있습니다. 수동 적용도 가능:

```bash
# mvn flyway:migrate 실행 (프로젝트에서)
./mvnw -f spring-sample/pom.xml flyway:migrate -Dflyway.configFiles=src/main/resources/flyway.conf
```

수동 SQL 적용 (mysql client 사용):

```bash
mysql -u root -p react_todolist_dev < spring-sample/src/main/resources/db/migration/V1__create_todos_table.sql
```

9. 검증

-   DB에 테이블이 생성됐는지 확인:

```sql
SHOW TABLES IN react_todolist_dev;
SELECT COUNT(*) FROM todos;
```

-   앱이 응답하는지 확인:

```bash
curl http://localhost:8080/api/todos
```

-   프론트에서 항목 추가 후 `GET /api/todos`로 확인

10. 백업 및 롤백

-   전체 DB 백업(예):

```bash
mysqldump -u root -p react_todolist_dev > react_todolist_dev_backup.sql
```

-   롤백(테이블 삭제, 주의 데이터 손실):

```sql
DROP TABLE IF EXISTS todos;
```

-   앱 롤백: 이전 JAR로 교체하고 서비스 재시작 또는 systemctl으로 이전 버전 활성화

11. 추가 참고

-   application.yml은 서버 환경에서 환경변수로 오버라이드 하도록 구성하세요. 예: `SPRING_DATASOURCE_URL` 등.
-   production 환경에서는 DB 비밀번호를 환경변수로 넣고 `.env` 파일은 안전하게 관리하세요.

끝.
