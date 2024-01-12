# ChartZoo

- 개인 branch를 생성하여 차트 추가 바람
- 상태관리나 ui컴포넌트 라이브러리는 자유롭게 추가

## 프로젝트 구조

```
src
|-- assets: csv, json 데이터세트 폴더
|-- charts: 차트 컴포넌트 폴더
|   |-- test: 테스트용 아무 내용 없는 컴포넌트
|   |-- bubblePlot: bubble plot 차트 컴포넌트
|   |-- ... 차트 추가시 이곳에 ...
|
|-- workspace: 메인 화면
|   |--AppBar.tsx 상단바
|   |--Dashboard.tsx 전체 화면
|   |--Drawer.tsx 좌측 서랍
|   |--MainView.tsx 중앙 화면
|
|-- App.tsx: route 설정

App.tsx에 있는 routes 배열을 export
이 routes 배열을 가지고...
1. App.tsx의 jsx에서 Route들을 생성함
2. workspace-Drawer.tsx에서 navigate가 가능한 좌측서랍을 생성함
```

## 차트 추가 방법

1. App.tsx의 routes 배열에 추가하고자 하는 컴포넌트 정보 삽입

```typescript
// 예시로 bar chart를 추가하겠다 하면
export const routes: [string, string, JSX.Element][] = [
  // 기존
  ['home', '', <>좌측 메뉴에서 표시할 차트 클릭</>],
  ['test페이지', 'test1', <Test />],
  ['bubblePlot', 'bubbleplot', <BubblePlot />]
  // 예를 들어 추가할 bar chart
  ['막대그래프', 'bar', ] // 차트 컴포넌트 만들기 전엔 비워둠
]
```

2. charts 폴더에 생성할 차트의 폴더와 tsx파일 생성
3. 1번의 routes 폴더에 추가한 요소의 3번째 index에 컴포넌트 삽입

```typescript
  ['막대그래프', 'bar', <BarPlot />]
```
