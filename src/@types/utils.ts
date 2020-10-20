// 각종 유틸리티 타입들

/*
함수 시그니처에서 매개변수 부분만 추출해 임의의 반환 타입을 추가한 새로운 시그니처를 반환함.
*/
export type OnlyParam<T extends (...args: any) => any, U> = (
  ...args: Parameters<T>
) => U;
