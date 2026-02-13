import { useEffect, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'

const OWNER = 'goldbergyoni'
const REPO = 'test-eyes'
const BRANCH = 'gh-data'

interface TestRun {
  runId: string
  prNumber: number
  commitSha: string
  createdAt: string
  tests: { name: string; durationMs: number; status: 'passed' | 'failed' }[]
}

interface AggregatedTest {
  name: string
  avgDurationMs: number
  failures: number
  runs: number
}

const columnHelper = createColumnHelper<AggregatedTest>()

const columns = [
  columnHelper.accessor('name', { header: 'Test Name', cell: info => info.getValue() }),
  columnHelper.accessor('avgDurationMs', {
    header: 'Avg Time (s)',
    cell: info => (info.getValue() / 1000).toFixed(2),
  }),
  columnHelper.accessor('failures', { header: 'Failures', cell: info => info.getValue() }),
  columnHelper.accessor('runs', { header: 'Runs', cell: info => info.getValue() }),
]

function aggregateTests(runs: TestRun[]): AggregatedTest[] {
  const map = new Map<string, { durations: number[]; failures: number }>()
  for (const run of runs) {
    for (const test of run.tests) {
      const entry = map.get(test.name) || { durations: [], failures: 0 }
      entry.durations.push(test.durationMs)
      if (test.status === 'failed') entry.failures++
      map.set(test.name, entry)
    }
  }
  return Array.from(map.entries()).map(([name, data]) => ({
    name,
    avgDurationMs: data.durations.reduce((a, b) => a + b, 0) / data.durations.length,
    failures: data.failures,
    runs: data.durations.length,
  }))
}

export default function App() {
  const [data, setData] = useState<AggregatedTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = `${import.meta.env.BASE_URL}data`

        // Fetch index.json with list of all data files
        const indexRes = await fetch(`${baseUrl}/index.json`)
        if (!indexRes.ok) throw new Error('No data yet - run some PRs first')
        const files: string[] = await indexRes.json()

        const runs: TestRun[] = []
        for (const file of files.filter(f => f !== 'index.json')) {
          const res = await fetch(`${baseUrl}/${file}`)
          if (res.ok) runs.push(await res.json())
        }

        setData(aggregateTests(runs))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Test History Dashboard</h1>
      <p className="text-gray-400 mb-6">Repo: {OWNER}/{REPO} | Data branch: {BRANCH}</p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-gray-700">
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left p-3 font-semibold">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="text-gray-500 mt-4">No test data yet. Run some PRs to collect data.</p>
      )}
    </div>
  )
}
