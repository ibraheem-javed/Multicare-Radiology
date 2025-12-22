import { useState } from 'react'
import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Card } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type AuditLog = {
  id: string
  action: 'created' | 'updated' | 'deleted' | 'accessed'
  entityType: 'Patient' | 'Request' | 'Report' | 'User'
  entityId: string
  changes: {
    old?: Record<string, any>
    new?: Record<string, any>
  } | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}

type Pagination = {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
}

type Filters = {
  entityType?: string
  action?: string
  userId?: string
  startDate?: string
  endDate?: string
}

type User = {
  id: string
  firstName: string
  lastName: string | null
  email: string
}

export default function AuditLogs() {
  const { logs, pagination, filters, users } = usePage<{
    logs: AuditLog[]
    pagination: Pagination
    filters: Filters
    users: User[]
  }>().props

  const [localFilters, setLocalFilters] = useState<Filters>(filters || {})
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    // Map camelCase to snake_case for backend
    const backendFilters: Record<string, any> = {}
    if (localFilters.entityType) backendFilters.entity_type = localFilters.entityType
    if (localFilters.action) backendFilters.action = localFilters.action
    if (localFilters.userId) backendFilters.user_id = localFilters.userId
    if (localFilters.startDate) backendFilters.start_date = localFilters.startDate
    if (localFilters.endDate) backendFilters.end_date = localFilters.endDate

    router.get('/audit-logs', backendFilters)
  }

  const resetFilters = () => {
    setLocalFilters({})
    router.get('/audit-logs')
  }

  const goToPage = (page: number) => {
    // Map camelCase to snake_case for backend
    const backendFilters: Record<string, any> = { page }
    if (localFilters.entityType) backendFilters.entity_type = localFilters.entityType
    if (localFilters.action) backendFilters.action = localFilters.action
    if (localFilters.userId) backendFilters.user_id = localFilters.userId
    if (localFilters.startDate) backendFilters.start_date = localFilters.startDate
    if (localFilters.endDate) backendFilters.end_date = localFilters.endDate

    router.get('/audit-logs', backendFilters)
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800'
      case 'updated':
        return 'bg-blue-100 text-blue-800'
      case 'deleted':
        return 'bg-red-100 text-red-800'
      case 'accessed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const toggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId)
  }

  const patientFieldOrder = [
    'id',
    'medicalRecordNumber',
    'firstName',
    'lastName',
    'dateOfBirth',
    'age',
    'gender',
    'phone',
    'nationalIdType',
    'nationalIdNumber',
    'addressLine',
    'city',
    'postalCode',
    'emergencyContactName',
    'emergencyContactPhone',
    'allergies',
    'createdAt',
    'updatedAt',
  ]

  const requestFieldOrder = [
    'id',
    'patientName',
    'procedureType',
    'requesterId',
    'requesterName',
    'requesterInformation',
    'requestDate',
    'status',
    'createdAt',
    'updatedAt',
  ]

  const reportFieldOrder = [
    'id',
    'patientName',
    'radiologistName',
    'reportDate',
    'status',
    'findings',
    'impression',
    'createdAt',
    'updatedAt',
  ]

  const formatFieldName = (fieldName: string) => {
    if (fieldName === 'patientName') return 'Patient Name'
    if (fieldName === 'requesterId') return 'Requester ID'
    if (fieldName === 'requesterName') return 'Requester Name'
    if (fieldName === 'requesterInformation') return 'Requester Information'
    if (fieldName === 'requestDate') return 'Request Date'
    if (fieldName === 'procedureType') return 'Procedure Type'
    if (fieldName === 'radiologistName') return 'Radiologist Name'
    if (fieldName === 'reportDate') return 'Report Date'

    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  const formatFieldValue = (value: any, fieldName?: string) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)

    if (fieldName === 'findings' || fieldName === 'impression') {
      return stripHtmlTags(String(value))
    }

    return String(value)
  }

  const transformRequestData = (data: Record<string, any>) => {
    const transformed: Record<string, any> = {}

    Object.keys(data).forEach((key) => {
      if (key !== 'patient' && key !== 'requester') {
        transformed[key] = data[key]
      }
    })

    if (data.patient) {
      transformed.patientName = `${data.patient.firstName} ${data.patient.lastName}`
    } else if (data.patientId) {
      transformed.patientName = `Patient ID: ${data.patientId}`
    }

    if (data.requester) {
      transformed.requesterId = data.requester.id
      transformed.requesterName = data.requester.name
      transformed.requesterInformation = data.requester.additionalInformation || '-'
    } else if (data.requesterId) {
      transformed.requesterId = data.requesterId
      transformed.requesterName = '-'
      transformed.requesterInformation = '-'
    }

    return transformed
  }

  const transformReportData = (data: Record<string, any>) => {
    const transformed: Record<string, any> = {}

    Object.keys(data).forEach((key) => {
      if (key !== 'patient' && key !== 'radiologist' && key !== 'request') {
        transformed[key] = data[key]
      }
    })

    if (data.patient) {
      transformed.patientName = `${data.patient.firstName} ${data.patient.lastName}`
    } else if (data.patientId) {
      transformed.patientName = `Patient ID: ${data.patientId}`
    }

    if (data.radiologist) {
      transformed.radiologistName = `${data.radiologist.firstName} ${
        data.radiologist.lastName || ''
      }`
    } else if (data.radiologistId) {
      transformed.radiologistName = `Radiologist ID: ${data.radiologistId}`
    } else {
      transformed.radiologistName = '-'
    }

    return transformed
  }

  const getOrderedFields = (data: Record<string, any>, entityType: string) => {
    let transformedData = data

    if (entityType === 'Patient') {
      return patientFieldOrder.filter((field) => field in data)
    }

    if (entityType === 'Request') {
      transformedData = transformRequestData(data)
      return requestFieldOrder.filter((field) => field in transformedData)
    }

    if (entityType === 'Report') {
      transformedData = transformReportData(data)
      return reportFieldOrder.filter((field) => field in transformedData)
    }

    return Object.keys(data)
  }

  const getTransformedFieldValue = (
    field: string,
    data: Record<string, any>,
    entityType: string
  ) => {
    if (entityType === 'Request') {
      const transformedData = transformRequestData(data)
      return transformedData[field]
    }
    if (entityType === 'Report') {
      const transformedData = transformReportData(data)
      return transformedData[field]
    }
    return data[field]
  }

  const isFieldChanged = (
    field: string,
    oldData?: Record<string, any>,
    newData?: Record<string, any>,
    entityType?: string
  ) => {
    if (!oldData || !newData) return false

    const oldValue = entityType
      ? getTransformedFieldValue(field, oldData, entityType)
      : oldData[field]
    const newValue = entityType
      ? getTransformedFieldValue(field, newData, entityType)
      : newData[field]

    return oldValue !== newValue
  }

  return (
    <>
      <Head title="Audit Logs" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <div className="text-sm text-gray-600">
            Total: {pagination.total} logs | Page {pagination.currentPage} of {pagination.lastPage}
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Entity Type</Label>
              <Select
                value={localFilters.entityType || undefined}
                onValueChange={(value) => handleFilterChange('entityType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Request">Request</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Action</Label>
              <Select
                value={localFilters.action || undefined}
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="accessed">Accessed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>User</Label>
              <Select
                value={localFilters.userId || undefined}
                onValueChange={(value) => handleFilterChange('userId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="max-w-[200px]">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !localFilters.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.startDate ? (
                      format(new Date(localFilters.startDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
                    onSelect={(date) => {
                      handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : '')
                    }}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="max-w-[200px]">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !localFilters.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.endDate ? (
                      format(new Date(localFilters.endDate), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
                    onSelect={(date) => {
                      handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : '')
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </Card>

        {/* Audit Logs Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <>
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                    <TableCell>
                      {log.user ? (
                        <div>
                          <div className="font-medium">
                            {log.user.firstName} {log.user.lastName}
                          </div>
                          <div className="text-xs text-gray-600">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">System</span>
                      )}
                    </TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{log.ipAddress || '-'}</TableCell>
                    <TableCell>
                      {log.changes && (
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          {expandedLogId === log.id ? 'Hide' : 'Show'} changes
                        </button>
                      )}
                    </TableCell>
                  </TableRow>

                  {expandedLogId === log.id && log.changes && (
                    <TableRow className="bg-muted">
                      <TableCell colSpan={6} className="p-4">
                        <div className="space-y-4">
                          <Table className="text-xs">
                            <TableHeader>
                              <TableRow
                                onClick={() => toggleExpand(log.id)}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                <TableHead>Field</TableHead>
                                {log.changes!.old && <TableHead>Before</TableHead>}
                                {log.changes!.new && <TableHead>After</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(() => {
                                const changes = log.changes!
                                const data = changes.old || changes.new || {}
                                const fields = getOrderedFields(data, log.entityType)

                                return fields.map((field) => {
                                  const changed = isFieldChanged(
                                    field,
                                    changes.old,
                                    changes.new,
                                    log.entityType
                                  )
                                  const rowClass = changed ? 'bg-yellow-50' : ''

                                  return (
                                    <TableRow key={field} className={rowClass}>
                                      <TableCell className="font-medium text-gray-700">
                                        {formatFieldName(field)}
                                      </TableCell>
                                      {changes.old && (
                                        <TableCell className="font-mono">
                                          {formatFieldValue(
                                            getTransformedFieldValue(
                                              field,
                                              changes.old,
                                              log.entityType
                                            ),
                                            field
                                          )}
                                        </TableCell>
                                      )}
                                      {changes.new && (
                                        <TableCell
                                          className={`font-mono ${
                                            changed ? 'font-semibold text-blue-700' : ''
                                          }`}
                                        >
                                          {formatFieldValue(
                                            getTransformedFieldValue(
                                              field,
                                              changes.new,
                                              log.entityType
                                            ),
                                            field
                                          )}
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  )
                                })
                              })()}
                            </TableBody>
                          </Table>

                          {log.userAgent && (
                            <div>
                              <h4 className="font-medium text-sm mb-1">User Agent:</h4>
                              <p className="text-xs text-gray-600">{log.userAgent}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => goToPage(pagination.currentPage - 1)}
            >
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.lastPage}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage === pagination.lastPage}
              onClick={() => goToPage(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
