import vine from '@vinejs/vine'
import { ReportStatus } from '#enums/report_status'

export const reportValidator = vine.compile(
  vine.object({
    requestId: vine.string().uuid(),
    findings: vine.string().minLength(10),
    impression: vine.string().nullable(),
    status: vine.enum(['draft', 'final'] as ReportStatus[]),
    reportDate: vine.date(),
    radiologistId: vine.string().uuid().nullable(),
  })
)

export const updateReportValidator = vine.compile(
  vine.object({
    findings: vine.string().minLength(10),
    impression: vine.string().nullable(),
    status: vine.enum(['draft', 'final'] as ReportStatus[]),
    reportDate: vine.date(),
    radiologistId: vine.string().uuid().nullable(),
  })
)
