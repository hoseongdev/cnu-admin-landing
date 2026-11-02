# 배포 안내

사이트는 **https://cnu-admin.com** 에서 서비스 중입니다.

> 서버 IP·계정·키 경로 같은 실제 접속 정보는 이 공개 저장소에 올리지 않습니다.
> 관리자는 로컬의 `DEPLOY.local.md` 를 참고하세요.

---

## 자동 배포

`main` 브랜치에 아래 파일이 변경되면 GitHub Actions가 서버로 자동 배포합니다.

```
index.html  data.js  style.css  app.js  images/**
```

**따라서 보통은 직접 서버에 올릴 일이 없습니다.** PR이 `main`에 머지되면 1~2분 안에 반영됩니다.

진행 상황은 저장소 **Actions** 탭에서 볼 수 있습니다.
배포 후 워크플로가 사이트 응답(HTTP 200)까지 확인하고, 실패하면 빨간 표시가 뜹니다.

수동으로 돌리려면 Actions → **Deploy** → **Run workflow**.

### 포크에서 보낸 PR

보안상 포크 PR에는 배포용 시크릿이 전달되지 않아 배포가 실행되지 않습니다.
저장소에 직접 브랜치를 만들어 PR을 올리면 머지 후 정상 배포됩니다.

---

## 서버 구성

| 항목 | 값 |
| --- | --- |
| 클라우드 | Oracle Cloud (ap-tokyo-1, Always Free) |
| OS | Ubuntu 24.04 LTS |
| 웹서버 | **Caddy** (nginx 아님) |
| 사이트 경로 | `/var/www/admin` |
| HTTPS | Caddy 자동 발급·자동 갱신 |

### Caddy 설정

```
cnu-admin.com, www.cnu-admin.com {
    root * /var/www/admin
    file_server
    encode gzip zstd

    # 사진·CSS는 길게 캐시
    @assets path *.jpg *.jpeg *.png *.webp *.svg *.css
    header @assets Cache-Control "public, max-age=2592000"

    # 내용 파일은 캐시하지 않음 (data.js 수정이 바로 반영되도록)
    @fresh path *.html *.js /
    header @fresh Cache-Control "no-cache"
}
```

설정을 바꿨다면 **반드시 검사 후 적용**하세요. `Valid configuration` 이 안 나오면 reload 하지 마세요.

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl reload caddy
```

---

## 배포 키 (관리자용)

자동 배포는 전용 SSH 키를 씁니다. 이 키는 **`/var/www/admin` 폴더에 rsync 하는 것 외에는 아무것도 못 합니다.**
서버의 `authorized_keys` 에서 `rrsync` 로 제한해 두었습니다.

```
command="/usr/bin/rrsync /var/www/admin",restrict ssh-ed25519 AAAA... github-actions-cnu-admin-landing
```

셸 접속, 포트 포워딩, 다른 경로 접근은 모두 차단됩니다.

### 저장소 시크릿

Settings → Secrets and variables → Actions

| 이름 | 내용 |
| --- | --- |
| `DEPLOY_SSH_KEY` | 배포 전용 개인키 |
| `DEPLOY_HOST` | 서버 주소 |
| `DEPLOY_USER` | 접속 계정 |
| `DEPLOY_KNOWN_HOSTS` | 서버 호스트키 (중간자 공격 방지) |

### 키를 교체할 때

```bash
ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-actions-cnu-admin-landing"

# 서버 authorized_keys 의 기존 줄을 지우고 아래 형식으로 추가
# command="/usr/bin/rrsync /var/www/admin",restrict <새 공개키>

gh secret set DEPLOY_SSH_KEY < deploy_key
rm deploy_key deploy_key.pub
```

---

## 문제가 생기면

| 증상 | 확인 |
| --- | --- |
| Actions가 빨간불 | Actions 탭에서 로그 확인. `Permission denied` 면 배포 키 만료·삭제 의심 |
| 머지했는데 반영 안 됨 | 바뀐 파일이 위 자동배포 대상 목록에 있는지 확인 |
| 사진이 안 나옴 | `images/` 안에 파일이 실제로 커밋됐는지 확인 |
| 보이는 건 그대론데 | 브라우저 강력 새로고침 (⌘+Shift+R) |
| 사이트 전체가 안 뜸 | 서버에서 `systemctl status caddy`, `sudo journalctl -u caddy -n 50` |

### 로컬 rsync 주의 (macOS)

macOS 기본 `rsync` 는 실제로는 **openrsync** 라서 서버의 제한된 배포 키와 호환되지 않습니다.
수동 배포가 필요하면 관리자 키를 쓰거나 `brew install rsync` 로 진짜 rsync를 설치하세요.
평소에는 자동 배포를 쓰면 됩니다.
