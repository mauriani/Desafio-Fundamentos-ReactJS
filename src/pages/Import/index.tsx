import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    // criar um Objecto vazio
    const data = new FormData();

    uploadedFiles.forEach(uploadedFile => {
      // adiciona os valores
      data.append('file', uploadedFile.file, uploadedFile.name);
    });

    try {
      await api.post('/transactions/import', data);
      toast.success('Importação realizada com sucesso!');
      history.push('/');
    } catch (err) {
      toast.error('Ocorreu um erro ao realizar importação');
    }
  }

  // dados do arquivo que está sendo inserido

  function submitFile(files: File[]): void {
    const filesUpload = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));
    setUploadedFiles(filesUpload);
  }

  console.log(uploadedFiles);

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
