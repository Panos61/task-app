import { useState, useRef } from 'react';
import { Select, Button, Divider } from '@mantine/core';
import { Gantt, ViewMode } from 'gantt-task-react';
import { useReactToPrint } from 'react-to-print';

import type { Task } from '@graphql/task/types';
import { useGanttType } from '../utils/useGanttType';

interface GanttViewProps {
  tasks: Task[];
}

const GanttView = ({ tasks }: GanttViewProps) => {
  const ganttTasks = useGanttType(tasks);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  const chartRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: chartRef,
    pageStyle: `
      @media print {
        @page {
          size: landscape;
        }
      }
    `
  });

  const handleViewPeriod = (value: string | null) => {
    if (value === 'Day') {
      setViewMode(ViewMode.Day);
    } else if (value === 'Week') {
      setViewMode(ViewMode.Week);
    } else if (value === 'Month') {
      setViewMode(ViewMode.Month);
    } else if (value === 'Year') {
      setViewMode(ViewMode.Year);
    }
  };

  return (
    <div className='flex flex-col gap-28 px-12'>
      <div className='flex flex-col gap-4 w-1/2'>
        <div className='flex flex-col gap-12'>
          <div className='flex items-center gap-8'>
            <span className='text-sm text-gray-400/95'>View by:</span>
            <Select
              data={['Day', 'Week', 'Month', 'Year']}
              defaultValue='Month'
              onChange={(value) => handleViewPeriod(value)}
              className='w-1/3'
            />
          </div>
          <Divider />
          <div className='flex flex-col gap-4'>
            <Button
              variant='light'
              className='w-min'
              onClick={() => reactToPrintFn()}
            >
              Print Preview
            </Button>
            <span className='text-sm text-gray-400/95'>
              This will open a print preview of this Gantt chart.
            </span>
          </div>
        </div>
      </div>
      <div ref={chartRef}>
        <Gantt
          tasks={ganttTasks || []}
          viewMode={viewMode}
          columnWidth={200}
          rowHeight={45}
          listCellWidth=''
        />
      </div>
    </div>
  );
};

export default GanttView;
