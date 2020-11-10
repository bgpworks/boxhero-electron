import React from 'react';
import { updateMethods } from '../../fromElectron';
import { useUpdateProgress } from '../../hooks/useUpdateProgress';

const UpdateProgressBar: React.FC = () => {
  const progressStat = useUpdateProgress();

  if (!progressStat) {
    return (
      <div>
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
