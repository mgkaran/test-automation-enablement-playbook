interface DataTableProps {
  caption?: string;
  headers: string[];
  rows: React.ReactNode[][];
  firstColumnHeader?: boolean;
}

/** A plain, readable table. Scrolls horizontally rather than squashing content. */
export default function DataTable({
  caption,
  headers,
  rows,
  firstColumnHeader = false,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-sm border border-line">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="border-b border-line bg-surface px-4 py-2 text-left text-sm text-muted">
            {caption}
          </caption>
        ) : null}
        <thead className="bg-surface">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-b border-line px-4 py-3 align-bottom font-semibold text-ink"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top even:bg-surface/60">
              {row.map((cell, cellIndex) =>
                firstColumnHeader && cellIndex === 0 ? (
                  <th
                    key={cellIndex}
                    scope="row"
                    className="border-b border-line px-4 py-3 font-semibold text-ink"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={cellIndex} className="border-b border-line px-4 py-3 text-ink-soft">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
