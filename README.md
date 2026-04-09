# claude-nook 🪺

프로젝트마다 흩어진 Claude Code 설정을 한눈에 보는 **로컬 대시보드**예요.   
</br>

> **빠른 설치 및 실행**                                                                                                   
>                                                                                                                     
> ```bash                                                                                                             
> npm install -g claude-nook && claude-nook                                                                           
> ``` 


<img width="1505" height="899" alt="image" src="https://github.com/user-attachments/assets/4d4fbaad-61ae-490d-ba66-831165da3e58" />




<br />

## 왜 만들었을까?

### 혹시 프로젝트마다 Claude Code 설정이 다 다르지 않으세요?

저는 프로젝트마다 Claude Code 설정을 다 다르게 해놨습니다..ㅎㅎ  
어떤 프로젝트는 MCP 서버 몇 개 붙여두고, 어떤 프로젝트는 hook을 따로 걸어두고, 플러그인도 프로젝트별로 다르게 켜두고… 이러다 보니 **"이 프로젝트에는 지금 뭐가 걸려 있더라?"** 하고 매번 `.claude/` 디렉토리를 확인했어요.

게다가 설정이 `~/.claude/settings.json` (user), 프로젝트의 `.claude/settings.json` (project), `settings.local.json` (local), `.mcp.json`까지 여러 곳에 흩어져 있어서 전체 그림을 잡기가 쉽지 않더라고요.

그래서 프로젝트마다의 Claude 설정을 **한눈에 볼 수 있게** 만들었습니다!

<br />

## 주요 기능

- **프로젝트 자동 탐지**: 홈 디렉토리 아래 여러 경로를 스캔해서 `.claude/` 설정이 있는 프로젝트를 사이드바에 자동으로 띄워요.
- **Plugins 뷰**: 설치된 플러그인을 한 카드로 정리해서 보여줘요. 토글 한 번으로 ON/OFF도 가능해요.
- **Hooks 뷰**: SessionStart, UserPromptSubmit, Stop 등 이벤트별로 어떤 command가 걸려 있는지 한눈에 볼 수 있어요.
- **MCP Servers 뷰**: 같은 이름의 서버를 묶어서 어떤 프로젝트들에 연결되어 있는지 한 번에 보여드려요.
- **Scope 색상 구분**: ![user](https://img.shields.io/badge/user-8b5cf6) ![project](https://img.shields.io/badge/project-3b82f6) ![local](https://img.shields.io/badge/local-f97316) 으로 구분해서 어느 scope에 걸려 있는지 바로 알 수 있어요.
- **Agents / Skills / Commands 뷰**: 프로젝트별 서브에이전트, 스킬, 슬래시 커맨드도 탭으로 확인할 수 있어요.

<br />

## 설치

Node.js 18 이상이면 바로 가능해요.

```bash
npm install -g claude-nook
```

<br />

## 사용법

브라우저가 `http://localhost:7007` 으로 알아서 열려요.

```bash
# 대시보드 실행 (Ctrl+C로 종료)
claude-nook

# 백그라운드로 실행
claude-nook -d

# 포트 바꾸기
claude-nook -p 8080

# 브라우저 자동 오픈 끄기
claude-nook --no-open
```

### 상태 확인 / 종료

```bash
# 현재 떠있는 인스턴스 확인
claude-nook status

# 종료 (여러 개면 선택지가 떠요)
claude-nook stop
```

<br />

> 💡 macOS에서 `~/Documents`나 `~/Downloads` 아래 프로젝트가 안 보이거나 토글이 안 되면, **시스템 설정 → 개인정보 보호 및 보안 → 파일 및 폴더** 에서 터미널에 접근 권한을 허용해주세요.

<br />

## 업데이트

v0.3.0부터는 대시보드에서 자동 업데이트가 가능해요. 그 이전 버전을 쓰고 있다면 한 번만 수동으로 올려주세요.

```bash
npm install -g claude-nook@latest
```

<br />

## 삭제

claude-nook은 자기 파일만 쓰기 때문에 이 한 줄이면 깔끔하게 사라져요.

```bash
npm uninstall -g claude-nook
```

<br />

## 안심하고 쓰세요

- 런타임 의존성 **제로**. Node.js 내장 모듈만 써요.
- 새 버전이 나오면 대시보드 헤더에 **업데이트 배지**가 떠요. 클릭 한 번으로 업데이트 + 서버 재시작까지 자동으로 돼요.
- 설정 파일은 **거의 읽기 전용**으로 다뤄요. 플러그인 토글을 누를 때만 해당 `settings.json`의 `enabledPlugins` 항목을 수정하고, 그 외 파일은 건드리지 않아요.
- 데이터는 전부 **로컬에서만** 처리돼요. 어디로도 보내지 않아요.

<br />

## 라이선스

[MIT](./LICENSE)

claude-nook이 마음에 드셨다면 ⭐️도 부탁드려요!  
버그 제보나 기능 제안은 [이슈](https://github.com/leevigong/claude-nook/issues)로 남겨주세요.
