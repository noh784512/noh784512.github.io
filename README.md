# 테니스 대회 이력 조회

국내 동호인 테니스 대회(KATA · KATO · 테니스타운) 이력을 한 번에 조회하는 정적 사이트.

🌐 https://noh784512.github.io

## 기능

- 선수 이름으로 3개 단체 통합 이력 조회 (남자부)
- 클럽(소속) 교집합 기반 동명이인 판별
- 단체별 색상 구분 UI (KATA / KATO / 테니스타운)

## 구조

```
.
├── index.html          메인 페이지
├── style.css           스타일
├── app.js              검색 + 매칭 로직
└── data/
    ├── kata.json       KATA 데이터
    ├── kato.json       KATO 데이터
    └── tennistown.json 테니스타운 데이터
```

## 카테고리 매핑

| KATA    | KATO       |
|---------|------------|
| 신인부  | 챌린저부   |
| 오픈부  | 마스터스부 |

테니스타운은 별도 랭킹 시스템으로 분리 표시.

## 로컬 실행

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 상태

- 현재 **샘플 데이터**로 동작 중
- 실제 크롤러(GitHub Actions 기반) 추후 연결 예정
