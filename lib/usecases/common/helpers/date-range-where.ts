import { and, Column, gt, gte, lt, lte, or } from "drizzle-orm";

export const getDateRangeWhere = <SC extends Column, EC extends Column>(
  startCol: SC,
  endCol: EC,
  start?: string,
  end?: string
) =>
  and(
    start && !end ? or(gte(startCol, start), gte(endCol, start)) : undefined,
    end && !start ? lte(endCol, end) : undefined,
    start && end
      ? or(
          // Fully within the range
          and(gte(startCol, start), lte(endCol, end)),
          // Starts before and ends within the range
          and(lt(startCol, start), lte(endCol, end), gte(endCol, start)),
          // Starts within and ends after the range
          and(gte(startCol, start), lte(startCol, end), gt(endCol, end)),
          // Spans outside the range
          and(lt(startCol, start), gt(endCol, end))
        )
      : undefined
  );
