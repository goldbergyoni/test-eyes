import { createColumnHelper } from '@tanstack/react-table'
import type { TestRow } from '../types'

const columnHelper = createColumnHelper<TestRow>()

const formatSeconds = (ms: number) => (ms / 1000).toFixed(2)

export const overviewColumns = [
  columnHelper.accessor('name', {
    header: 'Test Name',
  }),
  columnHelper.accessor('avgDurationMs', {
    header: 'Avg Time (s)',
    cell: (info) => formatSeconds(info.getValue()),
  }),
  columnHelper.accessor('failCount', {
    header: 'Failures',
  }),
  columnHelper.accessor('totalRuns', {
    header: 'Runs',
  }),
]

export const slowestColumns = [
  columnHelper.accessor('name', {
    header: 'Test Name',
  }),
  columnHelper.accessor('p95DurationMs', {
    header: 'p95 Time (s)',
    cell: (info) => formatSeconds(info.getValue()),
  }),
  columnHelper.accessor('avgDurationMs', {
    header: 'Avg Time (s)',
    cell: (info) => formatSeconds(info.getValue()),
  }),
  columnHelper.accessor('totalRuns', {
    header: 'Runs',
  }),
]
