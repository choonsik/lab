# Choonsik Lab

코딩 에이전트와 함께 만들고 기록하는 개인 실험실입니다.  
배포 주소: `https://choonsik.github.io/lab/`

## 특징

- **빌드 없는 정적 구조**: 순수 HTML/CSS/JS + `data/projects.json`으로 구성되어 GitHub Pages에서 바로 동작합니다.
- **3가지 분위기 전환**: 상단 스위처(또는 숫자 키 `1`, `2`, `3`)로 페이지 분위기를 즉시 바꿀 수 있습니다.
  - `노트` (`?theme=notebook`): 연구 일지 스타일의 깔끔한 목록형 인덱스
  - `터미널` (`?theme=terminal`): 다크 콘솔 무드의 밀도 높은 로그 뷰
  - `갤러리` (`?theme=gallery`): 시각적 프리뷰 카드 중심의 쇼케이스 그리드
- **데이터 중심 관리**: 새 실험을 추가할 때 HTML을 수정할 필요 없이 `data/projects.json`에 항목 하나만 추가하면 됩니다.

## 새 실험 추가하기

`data/projects.json`의 `projects` 배열에 아래 형식으로 객체를 추가하고 커밋·푸시하세요.

```json
{
  "id": "004",
  "slug": "my-new-experiment",
  "title": "새 실험 제목",
  "summary": "목록에 표시될 한 줄 요약",
  "why": "이 실험을 시작하게 된 계기",
  "category": "웹 앱",
  "status": "live",
  "date": "2026-11-24",
  "stack": ["TypeScript", "Canvas"],
  "links": {
    "live": "https://choonsik.github.io/my-new-experiment/",
    "repo": "https://github.com/choonsik/my-new-experiment"
  },
  "visual": "default",
  "thumbnail": "",
  "notes": "제작 중 기억에 남는 메모"
}
```

- `status`: `live` (웹 체험 가능), `local` (로컬 실행 도구), `prototype` (실험 중), `archived` (보관됨)
- `visual`: `thumbnail`이 비어 있을 때 표시되는 기본 일러스트 (`knowledge`, `nas`, `helicopter`, `default`)
- `thumbnail`: `assets/004.png`처럼 실제 스크린샷 경로를 넣으면 갤러리/상세 화면에 이미지가 표시됩니다.

## 로컬에서 미리보기

`fetch('./data/projects.json')`를 사용하므로 간단한 로컬 HTTP 서버로 열어보세요.

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속.

## GitHub Pages 배포

1. GitHub 저장소(`https://github.com/choonsik/lab`) → **Settings** → **Pages**
2. **Build and deployment** → Source를 **Deploy from a branch**로 선택
3. Branch를 `main`, 폴더를 `/ (root)`로 저장하면 잠시 뒤 `https://choonsik.github.io/lab/`에 배포됩니다.
