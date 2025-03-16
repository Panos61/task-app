import { Divider } from '@mantine/core';
import Header from './Header';

interface BoardLayoutProps {
  children: React.ReactNode;
  projectID: string;
  renderGantt: boolean;
  setRenderGantt: (value: boolean) => void;
}

const BoardLayout = ({ children, projectID, renderGantt, setRenderGantt }: BoardLayoutProps) => {
  return (
    <>
      <Header
        projectID={projectID}
        renderGantt={renderGantt}
        setRenderGantt={setRenderGantt}
      />
      <Divider className='mb-12' />
      {children}
    </>
  );
};

export default BoardLayout; 