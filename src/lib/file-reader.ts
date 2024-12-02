export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        console.log('File type:', file.type);
        console.log('File name:', file.name);
        console.log('File content preview:', 
          typeof event.target.result === 'string' 
            ? event.target.result.substring(0, 100) 
            : 'Binary content'
        );
        
        // For now, return the raw content
        resolve(event.target.result as string);
      } else {
        reject(new Error('ファイルの読み込みに失敗しました'));
      }
    };
    
    reader.onerror = () => {
      console.error('File reading error:', reader.error);
      reject(new Error('ファイルの読み込みに失敗しました'));
    };

    // PDFやWord文書の場合はバイナリとして読み込む
    if (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};