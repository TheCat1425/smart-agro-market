import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  emptyMessage?: string;
}

export default function DataTable({ headers, rows, emptyMessage = 'No data available' }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
