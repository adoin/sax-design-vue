import { readTableDataField } from '../change-utils'
import { equalTableDataValue } from '../change-snapshot'
import type { TableCellWriteDraft } from '../cell-write-plan'
import type { TableEditContext } from '../table-edit'
import type {
  TableValidationCell,
  TableValidationRule,
} from '../table-validation'
import type { TableValidation } from './use-table-validation'

/** Validate complete candidate rows without moving focus or committing partial data. */
export function validateTableCellWrites(
  validation: TableValidation,
  drafts: TableCellWriteDraft[],
  options: {
    signal: AbortSignal
    current: () => boolean
    maxErrors?: number
    rulesFor: (context: TableEditContext) => TableValidationRule[]
    locate: (context: TableEditContext) => Promise<boolean>
  },
) {
  function* cells(): Generator<TableValidationCell> {
    for (const draft of drafts) {
      const unchanged = () =>
        !options.signal.aborted &&
        options.current() &&
        draft.update.expected!.every((expected) => {
          const actual = readTableDataField(draft.row, expected.field)
          return (
            actual.exists === expected.exists &&
            equalTableDataValue(actual.value, expected.value)
          )
        })
      for (const { context, value } of draft.cells)
        yield {
          ...context,
          field: context.column.field!,
          draftRow: draft.draftRow,
          value,
          rules: options.rulesFor(context),
          isCurrent: unchanged,
          readValue: () =>
            readTableDataField(draft.draftRow, context.column.field!).value,
          locate: () => options.locate(context),
        }
    }
  }
  return validation.run(cells(), {
    signal: options.signal,
    clear: false,
    maxErrors: options.maxErrors,
    scrollToError: false,
  })
}
