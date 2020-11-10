import React from 'react';
import { updateMethods } from '../../fromElectron';
import { useUpdateProgress } from '../../hooks/useUpdateProgress';
import { useUpdateStat } from '../../hooks/useUpdateStat';

const UpdateStat: React.FC = () => {
  const { updateStat } = useUpdateStat();

  const msg = (() => {
    switch (updateStat) {
      case 'ready':
        return '준비중';
      case 'checking-for-update':
        return '업데이트 체크중';
      case 'error':
        return '에러 발생';
      case 'update-avaliable':
        return '사용 가능한 업데이트가 있음';
      case 'update-not-avaliable':
        return '사용가능한 업데이트가 없음';
    }
  })();

  return <p>{msg}</p>;
};

const UpdateProgressBar: React.FC = () => {
  const progressStat = useUpdateProgress();

  if (!progressStat) {
    return (
      <div>
        <UpdateStat />
        <button onClick={() => updateMethods.checkUpdate()}>
          업데이트 확인
        </button>
        <button onClick={() => updateMethods.downloadUpdate()}>
          다운로드 버튼
        </button>
        <p>다운로드 중 아님</p>
      </div>
    );
  }

  const { total, percent, bytesPerSecond, transferred } = progressStat;

  return (
    <div>
      <button onClick={() => updateMethods.cancelDownload()}>
        다운로드 취소
      </button>
      <p>total : {total}</p>
      <p>percent : {percent}</p>
      <p>bytesPerSecond : {bytesPerSecond}</p>
      <p>transferred : {transferred}</p>
    </div>
  );
};

export default UpdateProgressBar;
